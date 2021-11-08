import type { OpenAPIV3 } from "openapi-types";
import AliasEntity from "../../src/openapi/models/aliasEntity";
import Enum from "../../src/openapi/models/enum";
import InheritedEntity from "../../src/openapi/models/inheritedEntity";
import ObjectEntity from "../../src/openapi/models/objectEntity";
import UnionEntity from "../../src/openapi/models/unionEntity";
import OpenApi3Parser from "../../src/openapi/parsers/openApi3Parser";

function createParser() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return new OpenApi3Parser({} as any);
}

describe("OpenApi3Parser", () => {
  describe("parseSchemaObject", () => {
    it("returns simple type", () => {
      const definition: OpenAPIV3.SchemaObject = {
        type: "integer",
      };

      const { type } = createParser().parseSchemaObject("MyType", definition);

      expect(type).toBe("number");
    });

    it("generates a placeholder for reference object", () => {
      const definition: OpenAPIV3.ReferenceObject = {
        $ref: "#/components/schemas/Category",
      };

      const { type } = createParser().parseSchemaObject("MyType", definition);
      expect(type).toBeUndefined();
    });

    it("returns object entity", () => {
      const definition: OpenAPIV3.SchemaObject = {
        type: "object",
        properties: { foo: { type: "integer" }, bar: { type: "string" } },
      };

      const { type } = createParser().parseSchemaObject("MyType", definition);
      expect(type).toBeInstanceOf(ObjectEntity);

      expect(type).toMatchObject({
        name: "MyType",
        properties: [
          { name: "foo", type: { type: "number" } },
          { name: "bar", type: { type: "string" } },
        ],
      });
    });

    it("returns array of simple types", () => {
      const definition: OpenAPIV3.SchemaObject = {
        type: "array",
        items: {
          type: "string",
        },
      };

      const { type } = createParser().parseSchemaObject("MyType", definition);
      expect(type).toBeInstanceOf(AliasEntity);
      expect(type).toMatchObject({ isArray: true, referencedEntity: { type: "string" } });
    });

    it("returns array of entity references", () => {
      const definition: OpenAPIV3.SchemaObject = {
        type: "array",
        items: {
          $ref: "#/components/schemas/Tag",
        },
      };

      const { type } = createParser().parseSchemaObject("MyType", definition);
      expect(type).toBeInstanceOf(AliasEntity);
      expect(type).toMatchObject({ isArray: true, referencedEntity: { type: undefined } });
    });

    it("returns array of embedded entities", () => {
      const definition: OpenAPIV3.SchemaObject = {
        type: "array",
        items: {
          type: "object",
          properties: { foo: { type: "integer" }, bar: { type: "string" } },
        },
      };

      const parser = createParser();
      const { type } = parser.parseSchemaObject("MyType", definition);
      expect(type).toBeInstanceOf(AliasEntity);
      expect(type).toMatchObject({ isArray: true });

      const { type: innerType } = (type as AliasEntity).referencedEntity;
      expect(innerType).toBeInstanceOf(ObjectEntity);
      expect(innerType).toMatchObject({
        name: "MyTypeItem",
        properties: [
          { name: "foo", type: { type: "number" } },
          { name: "bar", type: { type: "string" } },
        ],
      });
    });

    it("returns enum", () => {
      const definition: OpenAPIV3.SchemaObject = {
        type: "string",
        enum: ["one", "two", "three"],
      };

      const { type } = createParser().parseSchemaObject("MyType", definition);
      expect(type).toBeInstanceOf(Enum);
      expect(type).toMatchObject({ items: ["one", "two", "three"] });
    });

    it("returns union when oneOf is used", () => {
      const definition: OpenAPIV3.SchemaObject = {
        type: "object",
        oneOf: [
          {
            $ref: "#/components/schemas/PartOne",
          },
          {
            $ref: "#/components/schemas/PartTwo",
          },
        ],
      };

      const { type } = createParser().parseSchemaObject("MyType", definition);
      expect(type).toBeInstanceOf(UnionEntity);
      const union = type as UnionEntity;
      expect(union.entities.length).toBe(2);
    });

    it("returns inherited entity when allOf is used", () => {
      const definition: OpenAPIV3.SchemaObject = {
        type: "object",
        allOf: [
          {
            $ref: "#/components/schemas/PartOne",
          },
          {
            $ref: "#/components/schemas/PartTwo",
          },
        ],
      };

      const { type } = createParser().parseSchemaObject("MyType", definition);
      expect(type).toBeInstanceOf(InheritedEntity);
      const union = type as InheritedEntity;
      expect(union.baseEntities.length).toBe(2);
    });
  });
});
