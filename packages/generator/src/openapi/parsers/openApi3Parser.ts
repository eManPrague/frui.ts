import { camelCase } from "lodash";
import type { OpenAPIV3 } from "openapi-types";
import { pascalCase } from "../../helpers";
import NameFormatter from "../formatters/nameFormatter";
import AliasEntity from "../models/aliasEntity";
import type ApiModel from "../models/apiModel";
import Endpoint from "../models/endpoint";
import EntityProperty from "../models/entityProperty";
import Enum from "../models/enum";
import InheritedEntity from "../models/inheritedEntity";
import ObjectEntity from "../models/objectEntity";
import Restriction from "../models/restriction";
import TypeReference from "../models/typeReference";
import UnionEntity from "../models/unionEntity";
import type { IApiParserConfig } from "../types";
import { isV3ReferenceObject, isV3SchemaObject } from "./helpers";

export default class OpenApi3Parser implements ApiModel {
  types = new Map<string, TypeReference>();
  endpoints: Endpoint[];

  constructor(private apiDocument: OpenAPIV3.Document, private config?: IApiParserConfig) {}

  parse() {
    if (this.apiDocument.components?.schemas) {
      for (const [name, definition] of Object.entries(this.apiDocument.components.schemas)) {
        this.parseSchemaObject(name, definition);
      }
    }

    this.parsePaths(this.apiDocument.paths);
  }

  parseSchemaObject(name: string, definition: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject): TypeReference {
    if (isV3ReferenceObject(definition)) {
      return this.parseReferenceObject(definition);
    } else if (definition.enum) {
      return this.parseEnum(name, definition);
    }

    switch (definition.type) {
      case "array": {
        const itemName = `${name}Item`;
        const innerType = this.parseSchemaObject(itemName, definition.items);

        const arrayName = `${name}Array`;
        const aliasType = new AliasEntity(arrayName, innerType, true);
        return this.setTypeReference(arrayName, aliasType);
      }

      case "object":
        return this.parseObject(name, definition);

      case "string":
        // eslint-disable-next-line sonarjs/no-nested-switch
        switch (definition.format) {
          case "binary":
            return this.setTypeReference(name, "Blob");
          case "date":
          case "datetime":
          case "date-time":
            return this.setTypeReference(name, "Date");
          default:
            return this.setTypeReference(name, "string");
        }

      case "integer":
      case "number":
        return this.setTypeReference(name, "number");

      case "boolean":
        return this.setTypeReference(name, definition.type);
    }

    if (definition.oneOf || definition.allOf) {
      return this.parseObject(name, definition);
    }

    throw new Error(`Could not parse object '${name}'`);
  }

  private parseReferenceObject(definition: OpenAPIV3.ReferenceObject) {
    const name = getReferencedEntityName(definition.$ref);
    return this.setTypeReference(name, undefined);
  }

  private parseEnum(name: string, definition: OpenAPIV3.SchemaObject) {
    const enumType = definition.enum ? new Enum(name, definition.enum as string[]) : undefined;
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
    const subTypes = definition.allOf!;

    const plainObjects = subTypes.filter(
      x => !isV3ReferenceObject(x) && x.type === "object" && !x.allOf && !x.oneOf
    ) as OpenAPIV3.SchemaObject[];

    const otherParents = subTypes
      .filter(x => !plainObjects.includes(x as OpenAPIV3.SchemaObject))
      .map((x, i) => this.parseSchemaObject(`${name}Parent${i + 1}`, x));

    const properties = plainObjects.flatMap(x => this.extractObjectProperties(name, x));

    const entity = new InheritedEntity(name, otherParents, properties);

    plainObjects.forEach(object =>
      object.required?.forEach(property => entity.addPropertyRestriction(property, Restriction.required, true))
    );

    return this.setTypeReference(name, entity);
  }

  private parseOneOfObject(name: string, definition: OpenAPIV3.SchemaObject) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const subTypes = definition.oneOf!;
    const innerTypes = subTypes.map((x, i) => this.parseSchemaObject(`${name}Option${i + 1}`, x));

    const entity = new UnionEntity(name, innerTypes);
    return this.setTypeReference(name, entity);
  }

  private parseObjectWithProperties(name: string, definition: OpenAPIV3.SchemaObject) {
    const properties = this.extractObjectProperties(name, definition);

    const entity = new ObjectEntity(name, properties);
    definition.required?.forEach(property => entity.addPropertyRestriction(property, Restriction.required, true));

    return this.setTypeReference(name, entity);
  }

  private extractObjectProperties(entityName: string, definition: OpenAPIV3.SchemaObject) {
    return definition.properties
      ? Object.entries(definition.properties).map(x => this.parseEntityProperty(entityName, x[0], x[1]))
      : [];
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
      if (definition.nullable !== undefined) {
        property.addRestriction(Restriction.nullable, definition.nullable);
      }
      if (definition.readOnly) {
        property.addRestriction(Restriction.readOnly, definition.readOnly);
      }
      if (definition.format) {
        property.addRestriction(Restriction.format, definition.format);
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

  parsePaths(paths: OpenAPIV3.PathsObject) {
    this.endpoints = Object.entries(paths)
      .flatMap(([path, methods]) =>
        Object.entries(methods ?? {}).map(([method, action]) => ({
          path,
          method: method.toLowerCase(),
          action: action as OpenAPIV3.OperationObject,
        }))
      )
      .filter(x => isHttpMethod(x.method))
      .map(x => this.parseEndpoint(x));
  }

  private parseEndpoint({ path, method, action }: { path: string; method: string; action: OpenAPIV3.OperationObject }) {
    path = this.config?.endpointUrlPrefix ? path.replace(this.config.endpointUrlPrefix, "") : path;
    const name = action.operationId ?? camelCase(method + "-" + path.replace(/\{\D*?\}/, "")); // the dash makes sure first path word starts with upper case

    const endpoint = new Endpoint(name);
    endpoint.path = path;
    endpoint.method = method;
    endpoint.repository = action.tags?.[0] ?? "General";
    endpoint.description = action.description?.trim() ?? action.summary?.trim();

    const parameters =
      action.parameters?.filter(
        (x: unknown): x is OpenAPIV3.ParameterObject & Required<Pick<OpenAPIV3.ParameterObject, "schema">> =>
          !!(x as OpenAPIV3.ParameterObject).schema
      ) ?? [];

    endpoint.pathParams = parameters
      .filter(x => x.in === "path")
      .map(x => {
        const param = this.parseEndpointParameter(name, x);
        NameFormatter.toCamelCase(param);
        return param;
      });

    const queryParams = parameters.filter(x => x.in === "query").map(x => this.parseEndpointParameter(name, x));
    if (queryParams.length) {
      const queryEntity = new ObjectEntity(name + "Query", queryParams);
      endpoint.queryParam = this.setTypeReference(queryEntity.name, queryEntity);
    }

    if (action.requestBody) {
      endpoint.requestBody = this.getRequestBodyType(name + "Request", action.requestBody);
    }

    endpoint.responses = {};
    Object.entries(action.responses).forEach(([code, response]) => {
      const responseBodyType = this.getResponseBodyType(`${name}Response${code}`, response);
      (endpoint.responses as Record<string, unknown>)[code] = responseBodyType;
    });

    return endpoint;
  }

  private parseEndpointParameter(
    parentName: string,
    input: OpenAPIV3.ParameterObject & Required<Pick<OpenAPIV3.ParameterObject, "schema">>
  ) {
    const type = this.parseSchemaObject(parentName, input.schema);
    const parameter = new EntityProperty(cleanParameterName(input.name), type);
    parameter.description = input.description;
    if (input.required) {
      parameter.addRestriction(Restriction.required, true);
    }
    return parameter;
  }

  private getRequestBodyType(
    fallbackName: string,
    input: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject
  ): { contentType: string; typeReference: TypeReference } | undefined {
    if (isV3ReferenceObject(input)) {
      const name = input.$ref.substr(input.$ref.lastIndexOf("/") + 1);
      const object = this.apiDocument.components?.requestBodies?.[name];
      return object ? this.getRequestBodyType(name, object) : undefined;
    } else {
      const contentType = Object.keys(input.content)[0];
      const schemaObject = input.content[contentType].schema;
      const typeReference = schemaObject && this.parseSchemaObject(fallbackName, schemaObject);
      return typeReference ? { contentType, typeReference } : undefined;
    }
  }

  private getResponseBodyType(
    fallbackName: string,
    input: OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject
  ): { contentType: string; typeReference: TypeReference } | undefined {
    if (isV3ReferenceObject(input)) {
      const name = input.$ref.substr(input.$ref.lastIndexOf("/") + 1);
      const object = this.apiDocument.components?.responses?.[name];
      return object ? this.getResponseBodyType(name, object) : undefined;
    } else {
      if (!input.content) {
        return undefined;
      }

      const contentType = Object.keys(input.content)[0];
      const schemaObject = input.content[contentType].schema;
      const typeReference = schemaObject && this.parseSchemaObject(fallbackName, schemaObject);
      return typeReference ? { contentType, typeReference } : undefined;
    }
  }
}

function getReferencedEntityName(ref: string) {
  return ref.replace("#/components/schemas/", "");
}

function isHttpMethod(method: string) {
  switch (method) {
    case "get":
    case "put":
    case "post":
    case "delete":
    case "option":
    case "head":
    case "patch":
    case "trace":
      return true;

    default:
      return false;
  }
}

function cleanParameterName(name: string) {
  if (name.endsWith("[]")) {
    return name.substring(0, name.length - 2);
  } else {
    return name;
  }
}
