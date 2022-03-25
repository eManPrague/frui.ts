export interface IApiConnector {
  /** Sends a HTTP GET request */
  get(url: string, params?: RequestInit): Promise<Response>;

  /** Sends the provided body as a HTTP POST request */
  post(url: string, body?: BodyInit, params?: RequestInit): Promise<Response>;

  /** Serializes the provided content and sends it as a HTTP POST request  */
  postObject(url: string, content: any, params?: RequestInit): Promise<Response>;

  /** Sends the provided body as a HTTP PUT request */
  put(url: string, body?: BodyInit, params?: RequestInit): Promise<Response>;

  /** Serializes the provided content and sends it as a HTTP PUT request  */
  putObject(url: string, content: any, params?: RequestInit): Promise<Response>;

  /** Sends the provided body as a HTTP PATCH request */
  patch(url: string, body?: BodyInit, params?: RequestInit): Promise<Response>;

  /** Serializes the provided content and sends it as a HTTP PATCH request  */
  patchObject(url: string, content: any, params?: RequestInit): Promise<Response>;

  /** Sends the provided body as a HTTP DELETE request */
  delete(url: string, body?: BodyInit, params?: RequestInit): Promise<Response>;

  /** Serializes the provided content and sends it as a HTTP DELETE request  */
  deleteObject(url: string, content: any, params?: RequestInit): Promise<Response>;
}
