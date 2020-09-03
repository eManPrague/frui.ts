import { OpenAPIV3 } from "openapi-types";
import { pascalCase } from "../../helpers";
import AliasEntity from "../models/aliasEntity";
import EntityProperty from "../models/entityProperty";
import Enum from "../models/enum";
import InheritedEntity from "../models/inheritedEntity";
import ObjectEntity from "../models/objectEntity";
import Restriction from "../models/restriction";
import TypeReference from "../models/typeReference";
import UnionEntity from "../models/unionEntity";
import { isV3ReferenceObject, isV3SchemaObject } from "./helpers";

export default class OpenApi3Parser {
  types = new Map<string, TypeReference>();

  parse(api: OpenAPIV3.Document) {
    if (api.components?.schemas) {
      for (const [name, definition] of Object.entries(api.components.schemas)) {
        this.parseSchemaObject(name, definition);
      }
    }
  }

  parseSchemaObject(name: string, definition: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject): TypeReference {
    if (isV3ReferenceObject(definition)) {
      return this.parseReferenceObject(definition);
    } else if (definition.enum) {
      return this.parseEnum(name, definition);
    }

    switch (definition.type) {
      case "array":
        const itemName = `${name}Item`;
        const innerType = this.parseSchemaObject(itemName, definition.items);

        const arrayName = `${name}List`;
        const aliasType = new AliasEntity(arrayName, innerType, true);
        return this.setTypeReference(arrayName, aliasType);

      case "object":
        return this.parseObject(name, definition);

      case "string":
        // eslint-disable-next-line @typescript-eslint/tslint/config
        switch (definition.format) {
          case "date":
          case "datetime":
          case "date-time":
            return this.setTypeReference("Date", "Date");
          default:
            return this.setTypeReference("string", "string");
        }

      case "integer":
      case "number":
        return this.setTypeReference("number", "number");

      case "boolean":
        return this.setTypeReference(definition.type, definition.type);
    }

    if (definition.oneOf || definition.allOf) {
      return this.parseObject(name, definition);
    }

    throw new Error("Not implemented");
  }

  private parseReferenceObject(definition: OpenAPIV3.ReferenceObject) {
    const name = getReferencedEntityName(definition.$ref);
    return this.setTypeReference(name, undefined);
  }

  private parseEnum(name: string, definition: OpenAPIV3.SchemaObject) {
    const enumType = definition.enum ? new Enum(name, definition.enum) : undefined;
    return this.setTypeReference(name, enumType);
  }

  private parseObject(name: string, definition: OpenAPIV3.SchemaObject) {
    if (definition.allOf) {
      return this.parseAllOfObject(name, definition);
    }
    if (definition.oneOf) {
      return this.parseOneOfObject(name, definition);
    }

    return this.parseObjectWithProperties(name, definition);
  }

  private parseAllOfObject(name: string, definition: OpenAPIV3.SchemaObject) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const innerTypes = definition.allOf!.map((x, i) => this.parseSchemaObject(`${name}Parent${i + 1}`, x));

    const entity = new InheritedEntity(name, innerTypes);
    return this.setTypeReference(name, entity);
  }

  private parseOneOfObject(name: string, definition: OpenAPIV3.SchemaObject) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const innerTypes = definition.oneOf!.map((x, i) => this.parseSchemaObject(`${name}Option${i + 1}`, x));

    const entity = new UnionEntity(name, innerTypes);
    return this.setTypeReference(name, entity);
  }

  private parseObjectWithProperties(name: string, definition: OpenAPIV3.SchemaObject) {
    const properties = definition.properties
      ? Object.entries(definition.properties).map(x => this.parseEntityProperty(name, x[0], x[1]))
      : [];

    const entity = new ObjectEntity(name, properties);
    definition.required?.forEach(property => entity.addPropertyRestriction(property, Restriction.required, true));

    return this.setTypeReference(name, entity);
  }

  private parseEntityProperty(
    entityName: string,
    propertyName: string,
    definition: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
  ) {
    const fallbackTypeName = entityName + pascalCase(propertyName);
    const type = this.parseSchemaObject(fallbackTypeName, definition);
    const property = new EntityProperty(propertyName, type);

    if (isV3SchemaObject(definition)) {
      property.description = definition.description;
      property.example = definition.example;

      // TODO add more validation restrictions here
      if (definition.maxLength) {
        property.addRestriction(Restriction.maxLength, definition.maxLength);
      }
      if (definition.minLength) {
        property.addRestriction(Restriction.minLength, definition.minLength);
      }
      if (definition.pattern) {
        property.addRestriction(Restriction.pattern, definition.pattern);
      }
    }

    return property;
  }

  private setTypeReference(name: string, type: TypeReference["type"]) {
    const existingReference = this.types.get(name);
    if (existingReference) {
      existingReference.type = existingReference.type ?? type;
      return existingReference;
    }

    const newReference = new TypeReference(type);
    this.types.set(name, newReference);
    return newReference;
  }
}

function getReferencedEntityName(ref: string) {
  return ref.replace("#/components/schemas/", "");
}
