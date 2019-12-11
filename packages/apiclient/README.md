# `@frui.ts/apiclient`

Fruits provides a simple abstraction for issuing backend calls.

Please note that you are not forced to use this library and you may make network calls from your repositories (or elsewhere) any way you want.

## IApiConnector

`IApiConnector` is an abstraction for making actual HTTP requests. It provides functions such as `get`, `postText` or `putJson`.

## FetchApiConnector

The default implementation `FetchApiConnector` uses `window.fetch` for network requests and a middleware that handles other than 2xx response status codes as errors by default.
The default middleware is called `handleErrorStatusMiddleware` and throws `FetchError` when the status code is other than 2xx.

If you want to use another HTTP client library such as Axios, you should implement the `IApiConnector` interface with something like `AxiosApiConnector` that would just translate the interface functions to Axios calls.

### Usage

```ts
// creating new FetchApiConnector with default behavior
const connector = new FetchApiConnector();
```

```ts
// FetchApiConnector with custom fetch function
import { fetch as fetchPolyfill } from "whatwg-fetch";
const connector = new FetchApiConnector(fetchPolyfill);
```

```ts
// FetchApiConnector with custom middleware
function middleware(response: Response) {
  if (response.status >= 500 && response.status < 600) {
    throw "Server error";
  } else {
    return response;
  }
}

const connector = new FetchApiConnector(window.fetch, middleware);
```

## RestRequestBuilder

`RestRequestBuilder` helps composing URLs in a fluent way. It is a stateful object that mutates its inner URL.

### Usage

```ts
const builder = new RestRequestBuilder(apiConnector, "www.base.url", { });
const invoices = await builder.one("customers", 123).all("invoices").get<Invoice[]>(); // GET to www.base.url/customers/123/invoices

builder.reset();

const users = await builder.all("users").post<User[]>({ foo: "bar" }); // POST to www.base.url/users with content { foo: "bar" }
```

```ts
// Bearer token in the header for all requests
const requestParams: RequestInit = {
  headers: { "authorization": "Bearer xxxyyyzzz" },
}
const builder = new RestRequestBuilder(apiConnector, "www.base.url", requestParams);
```

