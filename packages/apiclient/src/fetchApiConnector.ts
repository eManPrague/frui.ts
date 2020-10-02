import { bind } from "@frui.ts/helpers";
import FetchError from "./fetchError";
import { IApiConnector } from "./types";

const jsonContentType = "application/json";
type Middleware = (response: Response) => Response | PromiseLike<Response>;
type FetchFunction = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
type JsonSerializer = (value: any) => string;

/** Creates a new RequestInit based on the provided values and with a 'Content-Type: application/json' header. */
export function appendJsonHeader(params?: RequestInit): RequestInit {
  return {
    ...params,
    headers: {
      ...(params || {}).headers,
      "Content-Type": jsonContentType,
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
    content = await response.json();
  } catch {
    throw new FetchError(response);
  }
  throw new FetchError(response, content);
}

/**
 * API connector that uses the fetch function to call a backend.
 *
 * You can replace default fetch function or request middleware by providing
 * custom values through the constructor.
 */
export class FetchApiConnector implements IApiConnector {
  protected fetchFunction: FetchFunction;
  protected jsonSerializer: JsonSerializer;
  protected middleware: Middleware;

  constructor(configuration?: { fetchFunction?: FetchFunction; jsonSerializer?: JsonSerializer; middleware?: Middleware }) {
    this.fetchFunction = configuration?.fetchFunction ?? bind(window.fetch, window);
    this.jsonSerializer = configuration?.jsonSerializer ?? JSON.stringify;
    this.middleware = configuration?.middleware ?? handleErrorStatusMiddleware;
  }

  get(url: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "GET" }).then(this.middleware);
  }

  post(url: string, body?: BodyInit, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "POST", body }).then(this.middleware);
  }
  postJson(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.post(url, this.jsonSerializer(content), appendJsonHeader(params));
  }

  put(url: string, body?: BodyInit, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "PUT", body }).then(this.middleware);
  }
  putJson(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.put(url, this.jsonSerializer(content), appendJsonHeader(params));
  }

  patch(url: string, body?: BodyInit, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "PATCH", body }).then(this.middleware);
  }
  patchJson(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.patch(url, this.jsonSerializer(content), appendJsonHeader(params));
  }

  delete(url: string, body?: BodyInit, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "DELETE", body }).then(this.middleware);
  }
  deleteJson(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.delete(url, this.jsonSerializer(content), appendJsonHeader(params));
  }
}
