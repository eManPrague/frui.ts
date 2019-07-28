import { bind } from "@frui.ts/helpers";
import FetchError from "./FetchError";
import { IApiConnector } from "./types";

export class FetchApiConnector implements IApiConnector {
  constructor(private fetchFunction = bind(window.fetch, window)) {}

  getText(url: string, params?: RequestInit) {
    return this.fetchFunction(url, { ...params, method: "get" })
      .then(checkStatus)
      .then(x => x.text());
  }
  getJson<T>(url: string, params?: RequestInit): Promise<T> {
    return this.fetchFunction(url, { ...params, method: "get" })
      .then(checkStatus)
      .then(x => x.json());
  }
  getBlob(url: string, params?: RequestInit) {
    return this.fetchFunction(url, { ...params, method: "get" })
      .then(checkStatus)
      .then(x => x.blob());
  }
  postText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "post", body: text }).then(checkStatus);
  }
  postJson<TResult>(url: string, content: any, params?: RequestInit): Promise<TResult> {
    return this.postText(url, JSON.stringify(content), params).then(x => x.json());
  }
  postFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "post", body: data }).then(checkStatus);
  }
  putJson<TResult>(url: string, content: any, params?: RequestInit): Promise<TResult> {
    return this.putText(url, JSON.stringify(content), params).then(x => x.json());
  }
  putText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "put", body: text }).then(checkStatus);
  }
  putFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "put", body: data }).then(checkStatus);
  }
  delete(url: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "delete" }).then(checkStatus);
  }
}

async function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.json) {
    try {
      const content = await response.json();
      throw new FetchError(response, content);
    } catch {}
  }

  throw new FetchError(response);
}
