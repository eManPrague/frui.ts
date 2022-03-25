import { bind } from "@frui.ts/helpers";
import FetchError from "./fetchError";
import type { IApiConnector } from "./types";

export const jsonContentType = "application/json";
export type Middleware = (response: Response) => Response | PromiseLike<Response>;
export type FetchFunction = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
export type Serializer = (value: any) => string;

export function appendContentTypeHeader(contentType: string, params?: RequestInit): RequestInit {
  return {
    ...params,
    headers: {
      ...(params ?? {}).headers,
      "Content-Type": contentType,
    },
  };
}

/** Middleware used by FetchApiConnector to handle response status codes other than 2xx as errors */
export async function handleErrorStatusMiddleware(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  let content: any;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    content = await response.json();
  } catch {
    throw new FetchError(response);
  }
  throw new FetchError(response, content);
}

/**
 * API connector that uses the fetch function to call a backend.
 *
 * You can replace default fetch function, serializer, or request middleware by providing
 * custom values through the constructor.
 */
export class FetchApiConnector implements IApiConnector {
  protected fetchFunction: FetchFunction;
  protected serializer: Serializer;
  protected middleware: Middleware;
  protected appendContentHeader: (params?: RequestInit) => RequestInit;

  constructor(configuration?: {
    fetchFunction?: FetchFunction;
    serializer?: Serializer;
    middleware?: Middleware;
    contentType?: string;
  }) {
    this.fetchFunction = configuration?.fetchFunction ?? bind(window.fetch, window);
    this.serializer = configuration?.serializer ?? JSON.stringify;
    this.middleware = configuration?.middleware ?? handleErrorStatusMiddleware;

    const contentType = configuration?.contentType ?? jsonContentType;
    this.appendContentHeader = params => appendContentTypeHeader(contentType, params);
  }

  /** Sends a HTTP GET request */
  get(url: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "GET" }).then(this.middleware);
  }

  /** Sends the provided body as a HTTP POST request */
  post(url: string, body?: BodyInit, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "POST", body }).then(this.middleware);
  }

  /** Serializes the provided content and sends it as a HTTP POST request  */
  postObject(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.post(url, this.serializer(content), this.appendContentHeader(params));
  }

  /** Sends the provided body as a HTTP PUT request */
  put(url: string, body?: BodyInit, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "PUT", body }).then(this.middleware);
  }

  /** Serializes the provided content and sends it as a HTTP PUT request  */
  putObject(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.put(url, this.serializer(content), this.appendContentHeader(params));
  }

  /** Sends the provided body as a HTTP PATCH request */
  patch(url: string, body?: BodyInit, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "PATCH", body }).then(this.middleware);
  }

  /** Serializes the provided content and sends it as a HTTP PATCH request  */
  patchObject(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.patch(url, this.serializer(content), this.appendContentHeader(params));
  }

  /** Sends the provided body as a HTTP DELETE request */
  delete(url: string, body?: BodyInit, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "DELETE", body }).then(this.middleware);
  }

  /** Serializes the provided content and sends it as a HTTP DELETE request  */
  deleteObject(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.delete(url, this.serializer(content), this.appendContentHeader(params));
  }
}
