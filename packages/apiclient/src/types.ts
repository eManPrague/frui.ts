export interface IApiConnector {
  get(url: string, params?: RequestInit): Promise<Response>;

  post(url: string, body?: BodyInit, params?: RequestInit): Promise<Response>;
  postObject(url: string, content: any, params?: RequestInit): Promise<Response>;

  put(url: string, body?: BodyInit, params?: RequestInit): Promise<Response>;
  putObject(url: string, content: any, params?: RequestInit): Promise<Response>;

  patch(url: string, body?: BodyInit, params?: RequestInit): Promise<Response>;
  patchObject(url: string, content: any, params?: RequestInit): Promise<Response>;

  delete(url: string, body?: BodyInit, params?: RequestInit): Promise<Response>;
  deleteObject(url: string, content: any, params?: RequestInit): Promise<Response>;
}
