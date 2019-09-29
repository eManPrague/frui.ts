export interface IApiConnector {
  get(url: string, params?: RequestInit): Promise<Response>;

  postJson(url: string, content: any, params?: RequestInit): Promise<Response>;
  postText(url: string, text: string, params?: RequestInit): Promise<Response>;
  postFormData(url: string, data: FormData, params?: RequestInit): Promise<Response>;

  putJson(url: string, content: any, params?: RequestInit): Promise<Response>;
  putText(url: string, text: string, params?: RequestInit): Promise<Response>;
  putFormData(url: string, data: FormData, params?: RequestInit): Promise<Response>;

  patchJson(url: string, content: any, params?: RequestInit): Promise<Response>;
  patchText(url: string, text: string, params?: RequestInit): Promise<Response>;
  patchFormData(url: string, data: FormData, params?: RequestInit): Promise<Response>;

  delete(url: string, params?: RequestInit): Promise<Response>;
}
