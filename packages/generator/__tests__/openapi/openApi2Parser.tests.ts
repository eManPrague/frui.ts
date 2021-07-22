import { OpenAPIV2 } from "openapi-types";
import AliasEntity from "../../src/openapi/models/aliasEntity";
import Enum from "../../src/openapi/models/enum";
import ObjectEntity from "../../src/openapi/models/objectEntity";
import OpenApi2Parser from "../../src/openapi/parsers/openApi2Parser";

function createParser() {
  return new OpenApi2Parser({} as any);
}

describe("OpenApi2Parser", () => {
  describe("parseSchemaObject", () => {
    it("returns simple type", () => {
      const definition: OpenAPIV2.SchemaObject = {
        type: "integer",
      };

      const { type } = createParser().parseSchemaObject("MyType", definition);

      expect(type).toBe("number");
    });

    it("generates a placeholder for reference object", () => {
      const definition: OpenAPIV2.SchemaObject = {
        $ref: "#/definitions/Category",
      };

      const { type } = createParser().parseSchemaObject("MyType", definition);
      expect(type).toBeUndefined();
    });

    it("returns object entity", () => {
      const definition: OpenAPIV2.SchemaObject = {
        type: "object",
        properties: { foo: { type: "integer" }, bar: { type: "string" } },
      };

      const parser = createParser();
      const { type } = parser.parseSchemaObject("MyType", definition);
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
      const definition: OpenAPIV2.SchemaObject = {
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
      const definition: OpenAPIV2.SchemaObject = {
        type: "array",
        items: {
          type: "any",
          $ref: "#/definitions/Tag",
        },
      };

      const { type } = createParser().parseSchemaObject("MyType", definition);
      expect(type).toBeInstanceOf(AliasEntity);
      expect(type).toMatchObject({ isArray: true, referencedEntity: { type: undefined } });
    });

    it("returns enum", () => {
      const definition: OpenAPIV2.SchemaObject = {
        type: "string",
        enum: ["one", "two", "three"],
      };

      const { type } = createParser().parseSchemaObject("MyType", definition);
      expect(type).toBeInstanceOf(Enum);
      expect(type).toMatchObject({ items: ["one", "two", "three"] });
    });
  });
});
