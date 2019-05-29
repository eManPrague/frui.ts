import { bind } from "@frui.ts/helpers";
import { IApiConnector } from "./types";

export class FetchApiConnector implements IApiConnector {
  constructor(private fetchFunction = bind(window.fetch, window)) {
  }

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
    return this.fetchFunction(url, { ...params, method: "post", body: text })
      .then(checkStatus);
  }
  postFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "post", body: data })
      .then(checkStatus);
  }
  putText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "put", body: text })
      .then(checkStatus);
  }
  putFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "put", body: data })
      .then(checkStatus);
  }
  delete(url: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "delete" })
      .then(checkStatus);
  }
}

function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw response;
  }
}
