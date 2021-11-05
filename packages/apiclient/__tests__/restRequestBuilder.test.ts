import { mock } from "jest-mock-extended";
import type { IApiConnector } from "../src";
import { appendUrl, RestRequestBuilder } from "../src";

describe("appendUrl", () => {
  it("returns original url", () => {
    const url = appendUrl("www.eman.cz");

    expect(url).toBe("www.eman.cz");
  });

  it("combines constructor parameter", () => {
    const url = appendUrl("www.eman.cz", "kariera", "frontend-developer");

    expect(url).toBe("www.eman.cz/kariera/frontend-developer");
  });

  it("removes trailing slash", () => {
    const url = appendUrl("www.eman.cz/", "kariera");

    expect(url).toBe("www.eman.cz/kariera");
  });
});

describe("getQueryString", () => {
  it("flattens any object", () => {
    const connector = mock<IApiConnector>();
    const builder = new RestRequestBuilder(connector, "www.base.url", {});

    const query = { foo: "param1", bar: 123 };
    const result = builder.getQueryString(query);
    expect(result).toBe("foo=param1&bar=123");
  });
});

describe("RestRequestBuilder", () => {
  it("calls the api connector with composed URL", () => {
    const connector = mock<IApiConnector>();
    const builder = new RestRequestBuilder(connector, "www.base.url", {});

    void builder.one("users", 123).all("invoices").getRaw();
    expect(connector.get).toHaveBeenCalledWith("www.base.url/users/123/invoices", {});
  });

  describe("reset", () => {
    it("resets the URL to the baseUrl", () => {
      const connector = mock<IApiConnector>();
      const builder = new RestRequestBuilder(connector, "www.base.url", {});

      void builder.one("users", 123).all("invoices").getRaw();

      builder.reset();

      void builder.one("customers", 567).getRaw();

      expect(connector.get).toHaveBeenLastCalledWith("www.base.url/customers/567", {});
    });
  });
});
