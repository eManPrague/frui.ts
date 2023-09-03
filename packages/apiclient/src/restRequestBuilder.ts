import type { IStringifyOptions } from "qs";
import { stringify } from "qs";
import type { IApiConnector } from "./types";

const cleanupRegex = /\/+$/g; // removes trailing slash

export type Deserializer<T> = (response: Response) => Promise<T>;

export const ContentTypes = {
  json: "application/json,text/json",
};

export function appendAcceptHeader(params: RequestInit | undefined, acceptContentType: string): RequestInit {
  return {
    ...params,
    headers: {
      ...params?.headers,
      Accept: acceptContentType,
    },
  };
}

export function appendUrl(base: string, ...segments: any[]) {
  const basePath = base.replace(cleanupRegex, "");
  return segments.length ? `${basePath}/${segments.join("/")}` : basePath;
}

/**
 * Fluent URL builder that makes the network call with the underlying IApiConnector
 * Check https://github.com/ljharb/qs for query string customizations
 */
export class RestRequestBuilder {
  static DefaultQueryStringOptions: IStringifyOptions = { skipNulls: true };

  protected urlValue: string;
  queryStringOptions?: IStringifyOptions;

  objectContentType: string = ContentTypes.json;
  objectDeserializer: Deserializer<unknown> = x => x.json();

  get url() {
    return this.urlValue;
  }

  constructor(
    protected apiConnector: IApiConnector,
    private baseUrl: string,
    protected params?: RequestInit
  ) {
    this.reset();
  }

  reset() {
    this.urlValue = this.baseUrl.replace(cleanupRegex, "");
  }

  path(path: string): this {
    this.urlValue += "/" + path;
    return this;
  }

  all(path: string): this {
    this.urlValue += "/" + path;
    return this;
  }

  one(path: string, id?: any): this {
    this.urlValue += "/" + path;
    if (id !== undefined) {
      this.urlValue += `/${id}`;
    }
    return this;
  }

  get<T>(queryParams?: any): Promise<T> {
    const requestUrl = this.appendQuery(this.urlValue, queryParams);
    const params = appendAcceptHeader(this.params, this.objectContentType);
    return this.apiConnector.get(requestUrl, params).then(this.objectDeserializer as Deserializer<T>);
  }

  getRaw(queryParams?: any): Promise<Response> {
    const requestUrl = this.appendQuery(this.urlValue, queryParams);
    return this.apiConnector.get(requestUrl, this.params);
  }

  post<T>(content: any): Promise<T> {
    const params = appendAcceptHeader(this.params, this.objectContentType);
    return this.apiConnector.postObject(this.urlValue, content, params).then(this.objectDeserializer as Deserializer<T>);
  }

  postOnly(content: any): Promise<Response> {
    return this.apiConnector.postObject(this.urlValue, content, this.params);
  }

  postData(data?: BodyInit): Promise<Response> {
    return this.apiConnector.post(this.urlValue, data, this.params);
  }

  put<T>(content: any): Promise<T> {
    const params = appendAcceptHeader(this.params, this.objectContentType);
    return this.apiConnector.putObject(this.urlValue, content, params).then(this.objectDeserializer as Deserializer<T>);
  }

  putOnly(content: any): Promise<Response> {
    return this.apiConnector.putObject(this.urlValue, content, this.params);
  }

  putData(data?: BodyInit): Promise<Response> {
    return this.apiConnector.put(this.urlValue, data, this.params);
  }

  patch<T>(content: any): Promise<T> {
    const params = appendAcceptHeader(this.params, this.objectContentType);
    return this.apiConnector.patchObject(this.urlValue, content, params).then(this.objectDeserializer as Deserializer<T>);
  }

  patchOnly(content: any): Promise<Response> {
    return this.apiConnector.patchObject(this.urlValue, content, this.params);
  }

  patchData(data?: BodyInit): Promise<Response> {
    return this.apiConnector.patch(this.urlValue, data, this.params);
  }

  delete(content?: any): Promise<Response> {
    return content
      ? this.apiConnector.deleteObject(this.urlValue, content, this.params)
      : this.apiConnector.delete(this.urlValue, undefined, this.params);
  }

  withBaseUrl(url: string) {
    this.urlValue = url;
    return this;
  }

  getQueryString(query: any, queryStringOptions?: IStringifyOptions) {
    return stringify(query, queryStringOptions ?? this.queryStringOptions ?? RestRequestBuilder.DefaultQueryStringOptions);
  }

  appendQuery(url: string, query?: any, queryStringOptions?: IStringifyOptions) {
    if (!query) {
      return url;
    }

    const queryString = typeof query === "string" ? query : this.getQueryString(query, queryStringOptions);
    return `${url}?${queryString}`;
  }
}
