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
  private fetchFunction: FetchFunction;
  private jsonSerializer: JsonSerializer;
  private middleware: Middleware;

  constructor(configuration?: { fetchFunction?: FetchFunction; jsonSerializer?: JsonSerializer; middleware?: Middleware }) {
    this.fetchFunction = configuration?.fetchFunction ?? bind(window.fetch, window);
    this.jsonSerializer = configuration?.jsonSerializer ?? JSON.stringify;
    this.middleware = configuration?.middleware ?? handleErrorStatusMiddleware;
  }

  get(url: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "GET" }).then(this.middleware);
  }

  postText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "POST", body: text }).then(this.middleware);
  }

  postJson(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.postText(url, this.jsonSerializer(content), appendJsonHeader(params));
  }
  postFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "POST", body: data }).then(this.middleware);
  }
  putJson(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.putText(url, this.jsonSerializer(content), appendJsonHeader(params));
  }
  putText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "PUT", body: text }).then(this.middleware);
  }
  putFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "PUT", body: data }).then(this.middleware);
  }
  patchJson(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.patchText(url, this.jsonSerializer(content), appendJsonHeader(params));
  }
  patchText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "PATCH", body: text }).then(this.middleware);
  }
  patchFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "PATCH", body: data }).then(this.middleware);
  }

  delete(url: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "DELETE" }).then(this.middleware);
  }
  deleteJson(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.deleteText(url, this.jsonSerializer(content), appendJsonHeader(params));
  }
  deleteText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "DELETE", body: text }).then(this.middleware);
  }
}
