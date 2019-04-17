import { IApiConnector } from "@src/communication/types";
import { bind } from "@src/helpers/functionHelpers";

export class FetchApiConnector implements IApiConnector {
  constructor(private fetchFunction = bind(window.fetch, window)) {
  }

  public getText(url: string, params?: RequestInit) {
    return this.fetchFunction(url, { ...params, method: "get" })
      .then(checkStatus)
      .then(x => x.text());
  }
  public getJson<T>(url: string, params?: RequestInit): Promise<T> {
    return this.fetchFunction(url, { ...params, method: "get" })
      .then(checkStatus)
      .then(x => x.json());
  }
  public getBlob(url: string, params?: RequestInit) {
    return this.fetchFunction(url, { ...params, method: "get" })
      .then(checkStatus)
      .then(x => x.blob());
  }
  public postText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "post", body: text })
      .then(checkStatus);
  }
  public postFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "post", body: data })
      .then(checkStatus);
  }
  public putText(url: string, text: string, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "put", body: text })
      .then(checkStatus);
  }
  public putFormData(url: string, data: FormData, params?: RequestInit): Promise<Response> {
    return this.fetchFunction(url, { ...params, method: "put", body: data })
      .then(checkStatus);
  }
  public delete(url: string, params?: RequestInit): Promise<Response> {
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
