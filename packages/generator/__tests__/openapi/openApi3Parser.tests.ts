import { OpenAPIV3 } from "openapi-types";
import TypeDefinition from "../../src/openapi/models/typeDefinition";
import OpenApi3Parser from "../../src/openapi/parsers/openApi3Parser";

describe("OpenApi3Parser", () => {
  describe("parseType", () => {
    it("returns simple type", () => {
      const definition: OpenAPIV3.SchemaObject = {
        type: "integer",
      };

      const result = new OpenApi3Parser().parseType(definition);
      expect(result).toEqual({ name: "integer" });
    });

    it("returns entity reference", () => {
      const definition: OpenAPIV3.ReferenceObject = {
        $ref: "#/components/schemas/Category",
      };

      const result = new OpenApi3Parser().parseType(definition);
      expect(result).toEqual({ name: "Category", isEntity: true });
    });

    it("returns array of simple types", () => {
      const definition: OpenAPIV3.SchemaObject = {
        type: "array",
        items: {
          type: "string",
        },
      };

      const result = new OpenApi3Parser().parseType(definition);
      expect(result).toEqual({ name: "string", isArray: true });
    });

    it("returns array of entity references", () => {
      const definition: OpenAPIV3.SchemaObject = {
        type: "array",
        items: {
          $ref: "#/components/schemas/Tag",
        },
      };

      const result = new OpenApi3Parser().parseType(definition);
      expect(result).toEqual({ name: "Tag", isEntity: true, isArray: true });
    });

    it("returns enum", () => {
      const definition: OpenAPIV3.SchemaObject = {
        type: "string",
        enum: ["one", "two", "three"],
      };

      const result = new OpenApi3Parser().parseType(definition);
      expect(result).toMatchObject({ enumValues: ["one", "two", "three"] } as TypeDefinition);
    });
  });
});
