import { bind } from "@frui.ts/helpers";
import FetchError from "./fetchError";
import { IApiConnector } from "./types";

export class FetchApiConnector implements IApiConnector {
  constructor(private fetchFunction = bind(window.fetch, window), private handleError = defaultHandleError) {}

  getText(url: string, params?: RequestInit) {
    return this.fetchFunction(url, { ...params, method: "get" })
      .then(this.handleError)
      .then(x => x.text());
  }
  getJson<T>(url: string, params?: RequestInit): Promise<T> {
    return this.fetchFunction(url, { ...params, method: "get" })
      .then(this.handleError)
      .then(x => x.json());
  }
  getBlob(url: string, params?: RequestInit) {
    return this.fetchFunction(url, { ...params, method: "get" })
      .then(this.handleError)
      .then(x => x.blob());
  }
  postText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "post", body: text }).then(this.handleError);
  }
  postJson<TResult>(url: string, content: any, params?: RequestInit): Promise<TResult> {
    return this.postText(url, JSON.stringify(content), params).then(x => x.json());
  }
  postFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "post", body: data }).then(this.handleError);
  }
  putJson<TResult>(url: string, content: any, params?: RequestInit): Promise<TResult> {
    return this.putText(url, JSON.stringify(content), params).then(x => x.json());
  }
  putText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "put", body: text }).then(this.handleError);
  }
  putFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "put", body: data }).then(this.handleError);
  }
  patchJson<TResult>(url: string, content: any, params?: RequestInit): Promise<TResult> {
    return this.patchText(url, JSON.stringify(content), params).then(x => x.json());
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
