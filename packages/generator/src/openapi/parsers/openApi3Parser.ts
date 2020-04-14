import { upperFirst } from "lodash";
import { OpenAPIV3 } from "openapi-types";
import Constants from "../constants";
import Entity from "../models/entity";
import EntityProperty from "../models/entityProperty";
import Restriction from "../models/restriction";
import TypeDefinition from "../models/typeDefinition";
import { isArraySchemaObject, isReferenceObject, isSchemaObject } from "./helpers";

export default class OpenApi3Parser {
  parse(api: OpenAPIV3.Document) {
    if (api.components?.schemas) {
      const definitions = Object.entries(api.components.schemas);

      const entities = definitions.map(([name, definition]) => this.parseEntity(name, definition));
      return entities.filter(x => x) as Entity[];
    }

    return [] as Entity[];
  }

  private parseEntity(name: string, definition: OpenAPIV3.ReferenceObject | OpenAPIV3.BaseSchemaObject) {
    if (isReferenceObject(definition) || !definition.properties) {
      return undefined;
    }

    const properties = Object.entries(definition.properties).map(x => this.parseEntityProperty(name, x[0], x[1]));

    const entity = new Entity(name, properties);

    definition.required?.forEach(property => entity.addPropertyRestriction(property, Restriction.required, true));

    return entity;
  }

  private parseEntityProperty(entityName: string, name: string, definition: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject) {
    const type = this.parseType(definition);
    if (type.isEnum) {
      type.name = entityName + upperFirst(name);
    }

    const property = new EntityProperty(name, type);

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

  parseType(definition: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject): TypeDefinition {
    if (isReferenceObject(definition)) {
      return {
        name: getReferencedEntityName(definition.$ref),
        isEntity: true,
      };
    }

    const typeName = definition.type as string;

    if (isArraySchemaObject(definition)) {
      const type = this.parseType(definition.items);
      type.isArray = true;
      return type;
    }

    if (typeName === "string" && definition.enum) {
      return {
        name: "ENUM",
        isEnum: true,
        definition: definition.enum.join(Constants.enumSeparator),
      };
    }

    if (typeName === "string" && definition.format === "date-time") {
      return {
        name: "dateTime",
        definition: definition.format,
      };
    }

    if (!typeName) {
      if (definition.allOf) {
        const composed = Object.assign({}, ...(definition.allOf as any[]));
        return this.parseType(composed);
      }

      console.error("Cannot parse type", definition);
      throw new Error("Cannot parse type");
    }

    return {
      name: typeName,
      definition: definition.format,
    };
  }
}

function getReferencedEntityName(ref: string) {
  return ref.replace("#/components/schemas/", "");
}
