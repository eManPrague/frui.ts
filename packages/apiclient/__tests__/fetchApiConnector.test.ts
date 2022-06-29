import { describe, expect, it } from "vitest";
import { appendContentTypeHeader, jsonContentType } from "../src/fetchApiConnector";

describe("fetchApiConnector", () => {
  describe("appendContentTypeHeader", () => {
    it("appends header content type when input is undefined", () => {
      const input = undefined as any;

      const result = appendContentTypeHeader(jsonContentType, input);
      expect(result).toMatchObject({ headers: { "Content-Type": "application/json" } });
    });

    it("appends header content type when input does not contain headers", () => {
      const input = { method: "post" };

      const result = appendContentTypeHeader(jsonContentType, input);
      expect(result).toMatchObject({
        method: "post",
        headers: { "Content-Type": "application/json" },
      });
    });

    it("appends header content type when input contains headers", () => {
      const input = { headers: { Authorization: "basic" } };

      const result = appendContentTypeHeader(jsonContentType, input);
      expect(result).toMatchObject({
        headers: {
          Authorization: "basic",
          "Content-Type": "application/json",
        },
      });
    });

    it("overrides header content type", () => {
      const input = { headers: { "Content-Type": "text/plain" } };

      const result = appendContentTypeHeader(jsonContentType, input);
      expect(result).toMatchObject({
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
  });
});
