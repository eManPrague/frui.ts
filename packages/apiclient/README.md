# `@frui.ts/apiclient`

Frui.ts provides a simple abstraction for issuing backend calls.

Please note that you are not forced to use this library, and you may make network calls from your repositories (or elsewhere) any way you want.

## IApiConnector

`IApiConnector` is an abstraction for making actual HTTP requests. It provides raw functions (`get`, `post`, `put`, `patch`, `delete`) as well as their counterparts that serialize the content (`postObject`, `putObject`, `patchObject`, `deleteObject`).

## FetchApiConnector

The default implementation `FetchApiConnector` uses `window.fetch` for network requests, `JSON.stringify` as a serializer, and a middleware that handles other than 2xx response status codes as errors by default.
The default middleware is called `handleErrorStatusMiddleware` and throws `FetchError` when the status code is other than 2xx.

You can provide custom implementations of the fetch function, serializer, and middleware through the constructor. You can also customize content-type header.

If you want to use another HTTP client library such as Axios, you should implement the `IApiConnector` interface with a custom class `AxiosApiConnector` that would just translate the interface functions to Axios calls.

Also, if your backend uses XML, you should provide custom serializer and customize the `contentType` constructor parameter.

### Usage

```ts
// creating new FetchApiConnector with default behavior
const connector = new FetchApiConnector();
```

```ts
// FetchApiConnector with custom fetch function
import { fetch as fetchPolyfill } from "whatwg-fetch";
const connector = new FetchApiConnector({ fetchFunction: fetchPolyfill });
```

```ts
// FetchApiConnector with a custom middleware
function middleware(response: Response) {
  if (response.status >= 500 && response.status < 600) {
    throw "Server error";
  } else {
    return response;
  }
}

const connector = new FetchApiConnector({ middleware });
```

## RestRequestBuilder

`RestRequestBuilder` helps to compose URLs and properly serialize and deserialize the payload. It is a stateful object that mutates its inner URL. It uses the provided `apiConnector` to make the actual network call.

It provides three types of requests:

### a. Entity calls
The request payload is serialized and the response payload is deserialized to the specified entity type:

```ts
get<T>(queryParams?: any): Promise<T>;
post<T>(content: any): Promise<T>;
put<T>(content: any): Promise<T>;
patch<T>(content: any): Promise<T>;
```

### b. Request only calls
The request payload is serialized but the response is not touched.

```ts
getRaw(queryParams?: any): Promise<Response>;
postOnly(content: any): Promise<Response>;
putOnly(content: any): Promise<Response>;
patchOnly(content: any): Promise<Response>;
delete(content?: any): Promise<Response>;
```

### c. Custom calls
You can provide custom payload for the request, response payload is not touched.

```ts
postData(data?: BodyInit): Promise<Response>;
putData(data?: BodyInit): Promise<Response>;
patchData(data?: BodyInit): Promise<Response>;
```

### Usage

```ts
const builder = new RestRequestBuilder(apiConnector, "www.base.url", {});
const invoices = await builder.path(`customers/${customerId}/invoices/${invoiceId}`).get<Invoice[]>(); // GET to www.base.url/customers/123/invoices

builder.reset();

// you can also use fluent url builder
const fluentInvoices = await builder.one("customers", 123).all("invoices").get<Invoice[]>(); // GET to www.base.url/customers/123/invoices

builder.reset();

const users = await builder.all("users").post<User[]>({ foo: "bar" }); // POST to www.base.url/users with content { foo: "bar" }
```

```ts
// Bearer token in the header for all requests
const requestParams: RequestInit = {
  headers: { authorization: "Bearer xxxyyyzzz" },
};
const builder = new RestRequestBuilder(apiConnector, "www.base.url", requestParams);
```
