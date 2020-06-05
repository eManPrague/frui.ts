import { upperFirst } from "lodash";
import { OpenAPIV3 } from "openapi-types";
import Entity from "../models/entity";
import EntityProperty from "../models/entityProperty";
import Restriction from "../models/restriction";
import TypeDefinition from "../models/typeDefinition";
import { isArraySchemaObject, isReferenceObject, isSchemaObject } from "./helpers";
import Enum from "../models/enum";
import ApiModel from "../models/apiModel";

export default class OpenApi3Parser {
  parse(api: OpenAPIV3.Document) {
    const entities: Entity[] = [];
    const enums: Enum[] = [];

    if (api.components?.schemas) {
      for (const [name, definition] of Object.entries(api.components.schemas)) {
        if (isReferenceObject(definition)) {
          continue;
        }

        if (definition.enum) {
          enums.push({
            name,
            items: definition.enum,
          });
        } else {
          const entity = this.parseEntity(name, definition);
          if (entity) {
            const embeddedEnums = entity.properties
              .filter(x => x.type.enumValues)
              .map(
                x =>
                  ({
                    name: x.type.name,
                    items: x.type.enumValues,
                  } as Enum)
              );
            enums.push(...embeddedEnums);

            entities.push(entity);
          }
        }
      }
    }

    return new ApiModel(entities, enums);
  }

  private parseEntity(name: string, definition: OpenAPIV3.BaseSchemaObject) {
    if (!definition.properties) {
      return undefined;
    }

    const properties = Object.entries(definition.properties).map(x => this.parseEntityProperty(name, x[0], x[1]));

    const entity = new Entity(name, properties);

    definition.required?.forEach(property => entity.addPropertyRestriction(property, Restriction.required, true));

    return entity;
  }

  private parseEntityProperty(entityName: string, name: string, definition: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject) {
    const type = this.parseType(definition);
    if (type.enumValues) {
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
        return this.parseType(composed);
      }

      if (definition.oneOf) {
        const innerTypes = definition.oneOf.map(x => this.parseType(x));
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
