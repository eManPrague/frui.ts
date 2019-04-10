export interface IRequestBuilder {
  all(path: string): IRequestBuilder;
  one(path: string, id?: any): IRequestBuilder;

  get<T>(): Promise<T>;
}

export interface IApiConnector {
  getText(url: string, params?: RequestInit): Promise<string>;
  getJson<T>(url: string, params?: RequestInit): Promise<T>;
  getBlob(url: string, params?: RequestInit): Promise<Blob>;

  postText(url: string, text: string, params?: RequestInit): Promise<Response>;
  postFormData(url: string, data: FormData, params?: RequestInit): Promise<Response>;

  putText(url: string, text: string, params?: RequestInit): Promise<Response>;
  putFormData(url: string, data: FormData, params?: RequestInit): Promise<Response>;

  delete(url: string, params?: RequestInit): Promise<Response>;
}
