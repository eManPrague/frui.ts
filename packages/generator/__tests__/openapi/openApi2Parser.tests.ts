import OpenApi2Parser from "../../src/openapi/parsers/openApi2Parser";
import { OpenAPIV2 } from "openapi-types";

describe("OpenApi2Parser", () => {
  describe("parseType", () => {
    it("returns simple type", () => {
      const definition: OpenAPIV2.SchemaObject = {
        type: "integer",
      };

      const result = new OpenApi2Parser().parseType(definition);
      expect(result).toBe("integer");
    });

    it("returns entity reference", () => {
      const definition: OpenAPIV2.SchemaObject = {
        $ref: "#/definitions/Category",
      };

      const result = new OpenApi2Parser().parseType(definition);
      expect(result).toBe("entity:Category");
    });

    it("returns array of simple types", () => {
      const definition: OpenAPIV2.SchemaObject = {
        type: "array",
        items: {
          type: "string",
        },
      };

      const result = new OpenApi2Parser().parseType(definition);
      expect(result).toBe("array:string");
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
      expect(result).toBe("array:entity:Tag");
    });

    it("returns enum", () => {
      const definition: OpenAPIV2.SchemaObject = {
        type: "string",
        enum: ["one", "two", "three"],
      };

      const result = new OpenApi2Parser().parseType(definition);
      expect(result).toBe("enum:one|two|three");
    });
  });
});
