import OpenApi3Parser from "../../src/openapi/parsers/openApi3Parser";
import { OpenAPIV3 } from "openapi-types";

describe("OpenApi3Parser", () => {
  describe("parseType", () => {
    it("returns simple type", () => {
      const definition: OpenAPIV3.SchemaObject = {
        type: "integer",
      };

      const result = new OpenApi3Parser().parseType(definition);
      expect(result).toBe("integer");
    });

    it("returns entity reference", () => {
      const definition: OpenAPIV3.ReferenceObject = {
        $ref: "#/components/schemas/Category",
      };

      const result = new OpenApi3Parser().parseType(definition);
      expect(result).toBe("entity:Category");
    });

    it("returns array of simple types", () => {
      const definition: OpenAPIV3.SchemaObject = {
        type: "array",
        items: {
          type: "string",
        },
      };

      const result = new OpenApi3Parser().parseType(definition);
      expect(result).toBe("array:string");
    });

    it("returns array of entity references", () => {
      const definition: OpenAPIV3.SchemaObject = {
        type: "array",
        items: {
          $ref: "#/components/schemas/Tag",
        },
      };

      const result = new OpenApi3Parser().parseType(definition);
      expect(result).toBe("array:entity:Tag");
    });

    it("returns enum", () => {
      const definition: OpenAPIV3.SchemaObject = {
        type: "string",
        enum: ["one", "two", "three"],
      };

      const result = new OpenApi3Parser().parseType(definition);
      expect(result).toBe("enum:one|two|three");
    });
  });
});
