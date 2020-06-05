import { OpenAPIV2 } from "openapi-types";
import TypeDefinition from "../../src/openapi/models/typeDefinition";
import OpenApi2Parser from "../../src/openapi/parsers/openApi2Parser";

describe("OpenApi2Parser", () => {
  describe("parseType", () => {
    it("returns simple type", () => {
      const definition: OpenAPIV2.SchemaObject = {
        type: "integer",
      };

      const result = new OpenApi2Parser().parseType(definition);
      expect(result).toEqual({ name: "integer" });
    });

    it("returns entity reference", () => {
      const definition: OpenAPIV2.SchemaObject = {
        $ref: "#/definitions/Category",
      };

      const result = new OpenApi2Parser().parseType(definition);
      expect(result).toEqual({ name: "Category", isEntity: true });
    });

    it("returns array of simple types", () => {
      const definition: OpenAPIV2.SchemaObject = {
        type: "array",
        items: {
          type: "string",
        },
      };

      const result = new OpenApi2Parser().parseType(definition);
      expect(result).toEqual({ name: "string", isArray: true });
    });

    it("returns array of entity references", () => {
      const definition: OpenAPIV2.SchemaObject = {
        type: "array",
        items: {
          type: "any",
          $ref: "#/definitions/Tag",
        },
      };

      const result = new OpenApi2Parser().parseType(definition);
      expect(result).toEqual({ name: "Tag", isEntity: true, isArray: true });
    });

    it("returns enum", () => {
      const definition: OpenAPIV2.SchemaObject = {
        type: "string",
        enum: ["one", "two", "three"],
      };

      const result = new OpenApi2Parser().parseType(definition);
      expect(result).toMatchObject({ enumValues: ["one", "two", "three"] } as TypeDefinition);
    });
  });
});
