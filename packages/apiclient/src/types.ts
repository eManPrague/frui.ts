export interface IApiConnector {
  get(url: string, params?: RequestInit): Promise<Response>;

  post(url: string, body?: BodyInit, params?: RequestInit): Promise<Response>;
  postJson(url: string, content: any, params?: RequestInit): Promise<Response>;

  put(url: string, body?: BodyInit, params?: RequestInit): Promise<Response>;
  putJson(url: string, content: any, params?: RequestInit): Promise<Response>;

  patch(url: string, body?: BodyInit, params?: RequestInit): Promise<Response>;
  patchJson(url: string, content: any, params?: RequestInit): Promise<Response>;

  delete(url: string, body?: BodyInit, params?: RequestInit): Promise<Response>;
  deleteJson(url: string, content: any, params?: RequestInit): Promise<Response>;
}
