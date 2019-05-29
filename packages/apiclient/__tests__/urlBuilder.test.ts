// tslint:disable no-duplicate-string
import { UrlBuilder } from "../src/urlBuilder";

describe("urlBuilder", () => {
  it("returns original url", () => {
    const builder = new UrlBuilder("www.eman.cz");

    expect(builder.url).toBe("www.eman.cz");
  });

  it("combines constructor parameter", () => {
    const builder = new UrlBuilder("www.eman.cz", "kariera", "frontend-developer");

    expect(builder.url).toBe("www.eman.cz/kariera/frontend-developer");
  });

  it("removes trailing slash", () => {
    const builder = new UrlBuilder("www.eman.cz/", "kariera");

    expect(builder.url).toBe("www.eman.cz/kariera");
  });

  describe("all", () => {
    it("returns a new builder", () => {
      const builder = new UrlBuilder("www.eman.cz");

      const result = builder.all("kariera");
      expect(result).not.toBe(builder);
    });

    it("combines the url with new path", () => {
      const builder = new UrlBuilder("www.eman.cz");

      const result = builder.all("kariera");
      expect(result.url).toBe("www.eman.cz/kariera");
    });

  });

  describe("one", () => {
    it("returns a new builder", () => {
      const builder = new UrlBuilder("www.eman.cz/");

      const result = builder.one("kariera");
      expect(result).not.toBe(builder);
    });

    it("combines the url with new path", () => {
      const builder = new UrlBuilder("www.eman.cz");

      const result = builder.one("kariera");
      expect(result.url).toBe("www.eman.cz/kariera");
    });

    it("combines the url with new path and id", () => {
      const builder = new UrlBuilder("www.eman.cz");

      const result = builder.one("kariera", "frontend-developer");
      expect(result.url).toBe("www.eman.cz/kariera/frontend-developer");
    });
  });
});
