import { OpenAPIV3 } from "openapi-types";
import { pascalCase } from "../../helpers";
import Entity from "../models/entity";
import EntityProperty from "../models/entityProperty";
import Enum from "../models/enum";
import ObjectEntity from "../models/objectEntity";
import Restriction from "../models/restriction";
import TypeDefinition from "../models/typeDefinition";
import TypeEntity from "../models/typeEntity";
import { isArraySchemaObject, isReferenceObject, isSchemaObject } from "./helpers";

export default class OpenApi3Parser {
  entities: Entity[] = [];
  enums: Enum[] = [];

  parse(api: OpenAPIV3.Document) {
    if (api.components?.schemas) {
      for (const [name, definition] of Object.entries(api.components.schemas)) {
        if (isReferenceObject(definition)) {
          continue;
        }

        this.parseEntity(name, definition);
      }
    }
  }

  private parseEntity(name: string, definition: OpenAPIV3.SchemaObject) {
    if (definition.enum) {
      this.enums.push(new Enum(name, definition.enum));
    } else if (definition.type === "object") {
      this.parseObjectEntity(name, definition);
    } else {
      const type = this.parseType(name, definition);
      this.entities.push(new TypeEntity(name, type));
    }
  }

  private parseObjectEntity(name: string, definition: OpenAPIV3.BaseSchemaObject) {
    if (!definition.properties) {
      return;
    }

    const properties = Object.entries(definition.properties).map(x => this.parseEntityProperty(name, x[0], x[1]));
    const entity = new ObjectEntity(name, properties);

    definition.required?.forEach(property => entity.addPropertyRestriction(property, Restriction.required, true));

    this.entities.push(entity);
  }

  private parseEntityProperty(
    entityName: string,
    propertyName: string,
    definition: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
  ) {
    const fallbackTypeName = entityName + pascalCase(propertyName);
    const type = this.parseType(fallbackTypeName, definition);
    if (type.enumValues) {
      type.name = fallbackTypeName;
      this.enums.push(new Enum(type.name, type.enumValues));
    }

    const property = new EntityProperty(propertyName, type);

    if (isSchemaObject(definition)) {
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

  // eslint-disable-next-line
  parseType(fallbackName: string, definition: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject): TypeDefinition {
    if (isReferenceObject(definition)) {
      return {
        name: getReferencedEntityName(definition.$ref),
        isEntity: true,
      };
    }

    const typeName = definition.type as string;

    if (isArraySchemaObject(definition)) {
      const type = this.parseType(`${fallbackName}Item`, definition.items);
      type.isArray = true;
      return type;
    }

    if (typeName === "object") {
      const entityName = pascalCase(fallbackName);
      this.parseObjectEntity(entityName, definition);
      return {
        name: entityName,
        isEntity: true,
      };
    }

    if (typeName === "string" && definition.enum) {
      return {
        name: "ENUM",
        enumValues: definition.enum.map(x => String(x)),
      };
    }

    if (typeName === "string" && definition.format === "date-time") {
      return {
        name: "dateTime",
        format: definition.format,
      };
    }

    if (!typeName) {
      if (definition.allOf) {
        const composed = Object.assign({}, ...(definition.allOf as any[]));
        return this.parseType(fallbackName, composed);
      }

      if (definition.oneOf) {
        const innerTypes = definition.oneOf.map((x, i) => this.parseType(fallbackName + i, x));
        if (innerTypes.length === 1) {
          return innerTypes[0];
        } else {
          return {
            name: innerTypes.map(x => x.name).join(" | "),
            innerTypes: innerTypes,
          };
        }
      }

      console.error("OpenAPI3 parser cannot parse type. Unknown type: ", definition);
      throw new Error("Cannot parse type");
    }

    return {
      name: typeName,
      format: definition.format,
    };
  }
}

function getReferencedEntityName(ref: string) {
  return ref.replace("#/components/schemas/", "");
}
