import { bind } from "@frui.ts/helpers";
import FetchError from "./fetchError";
import { IApiConnector } from "./types";

export class FetchApiConnector implements IApiConnector {
  constructor(private fetchFunction = bind(window.fetch, window), private handleError = defaultHandleError) {}

  get(url: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "get" }).then(this.handleError);
  }

  postText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "post", body: text }).then(this.handleError);
  }

  postJson(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.postText(url, JSON.stringify(content), appendJsonHeader(params));
  }
  postFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "post", body: data }).then(this.handleError);
  }
  putJson(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.putText(url, JSON.stringify(content), appendJsonHeader(params));
  }
  putText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "put", body: text }).then(this.handleError);
  }
  putFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "put", body: data }).then(this.handleError);
  }
  patchJson(url: string, content: any, params?: RequestInit): Promise<Response> {
    return this.patchText(url, JSON.stringify(content), appendJsonHeader(params));
  }
  patchText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "patch", body: text }).then(this.handleError);
  }
  patchFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "patch", body: data }).then(this.handleError);
  }
  delete(url: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "delete" }).then(this.handleError);
  }
}

async function defaultHandleError(response: Response) {
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

const jsonContentType = "application/json";

export function appendJsonHeader(params?: RequestInit) {
  return {
    ...params,
    headers: {
      ...(params || {}).headers,
      "Content-Type": jsonContentType,
    },
  };
}
