import { bind } from "@frui.ts/helpers";
import FetchError from "./fetchError";
import { IApiConnector } from "./types";

const jsonContentType = "application/json";
type Middleware = (response: Response) => Response | PromiseLike<Response>;

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
  constructor(private fetchFunction = bind(window.fetch, window), private middleware: Middleware = handleErrorStatusMiddleware) {}

  get(url: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "get" }).then(this.middleware);
  }

  postText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "post", body: text }).then(this.middleware);
  }

  postJson(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.postText(url, JSON.stringify(content), appendJsonHeader(params));
  }
  postFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "post", body: data }).then(this.middleware);
  }
  putJson(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.putText(url, JSON.stringify(content), appendJsonHeader(params));
  }
  putText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "put", body: text }).then(this.middleware);
  }
  putFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "put", body: data }).then(this.middleware);
  }
  patchJson(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.patchText(url, JSON.stringify(content), appendJsonHeader(params));
  }
  patchText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "patch", body: text }).then(this.middleware);
  }
  patchFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "patch", body: data }).then(this.middleware);
  }

  delete(url: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "delete" }).then(this.middleware);
  }
  deleteJson(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.deleteText(url, JSON.stringify(content), appendJsonHeader(params));
  }
  deleteText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "delete", body: text }).then(this.middleware);
  }
}
