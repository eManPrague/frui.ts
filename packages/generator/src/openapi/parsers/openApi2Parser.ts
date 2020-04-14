import { upperFirst } from "lodash";
import { OpenAPIV2 } from "openapi-types";
import { isArray } from "util";
import Constants from "../constants";
import Entity from "../models/entity";
import EntityProperty from "../models/entityProperty";
import Restriction from "../models/restriction";
import TypeDefinition from "../models/typeDefinition";

export default class OpenApi2Parser {
  parse(api: OpenAPIV2.Document) {
    if (api.definitions) {
      const definitions = Object.entries(api.definitions);

      const entities = definitions.map(([name, definition]) => this.parseEntity(name, definition));
      return entities.filter(x => x) as Entity[];
    }

    return [];
  }

  private parseEntity(name: string, definition: OpenAPIV2.SchemaObject) {
    if (!definition.properties) {
      return undefined;
    }

    const properties = Object.entries(definition.properties).map(x => this.parseEntityProperty(name, x[0], x[1]));

    const entity = new Entity(name, properties);

    definition.required?.forEach(property => entity.addPropertyRestriction(property, Restriction.required, true));

    return entity;
  }

  private parseEntityProperty(entityName: string, name: string, definition: OpenAPIV2.SchemaObject) {
    const type = this.parseType(definition);
    if (type.isEnum) {
      type.name = entityName + upperFirst(name);
    }

    const property = new EntityProperty(name, type);
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

    return property;
  }

  parseType(definition: OpenAPIV2.SchemaObject | OpenAPIV2.ItemsObject): TypeDefinition {
    if (definition.$ref) {
      return {
        name: getReferencedEntityName(definition.$ref),
        isEntity: true,
      };
    }

    const typeName = isArray(definition.type) ? definition.type[0] : definition.type;

    if (typeName === "array" && definition.items) {
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
  return ref.replace("#/definitions/", "");
}
