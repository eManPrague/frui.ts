import type { StringifiableRecord, StringifyOptions } from "query-string";
import { stringify } from "query-string";
import type { IApiConnector } from "./types";

const cleanupRegex = /\/+$/g; // removes trailing slash

export const ContentTypes = {
  json: "application/json,text/json",
};

export function appendAcceptHeader(params: RequestInit | undefined, acceptContentType: string): RequestInit {
  return {
    ...params,
    headers: {
      ...(params ?? {}).headers,
      Accept: acceptContentType,
    },
  };
}

export function appendUrl(base: string, ...segments: any[]) {
  const basePath = base.replace(cleanupRegex, "");
  return segments.length ? `${basePath}/${segments.join("/")}` : basePath;
}

/** Fluent URL builder that makes the network call with the underlying IApiConnector */
export class RestRequestBuilder {
  static DefaultQueryStringOptions: StringifyOptions = { skipNull: true };

  protected urlValue: string;
  queryStringOptions?: StringifyOptions;

  get url() {
    return this.urlValue;
  }

  constructor(protected apiConnector: IApiConnector, private baseUrl: string, protected params?: RequestInit) {
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
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      this.urlValue += `/${id}`;
    }
    return this;
  }

  get<T>(queryParams?: StringifiableRecord): Promise<T> {
    const requestUrl = this.appendQuery(this.urlValue, queryParams);
    const params = appendAcceptHeader(this.params, ContentTypes.json);
    return this.apiConnector.get(requestUrl, params).then(x => x.json() as Promise<T>);
  }

  getRaw(queryParams?: StringifiableRecord) {
    const requestUrl = this.appendQuery(this.urlValue, queryParams);
    return this.apiConnector.get(requestUrl, this.params);
  }

  post<T>(content: any): Promise<T> {
    const params = appendAcceptHeader(this.params, ContentTypes.json);
    return this.apiConnector.postJson(this.urlValue, content, params).then(x => x.json() as Promise<T>);
  }

  postOnly(content: any) {
    return this.apiConnector.postJson(this.urlValue, content, this.params);
  }

  postData(data?: BodyInit) {
    return this.apiConnector.post(this.urlValue, data, this.params);
  }

  put<T>(content: any): Promise<T> {
    const params = appendAcceptHeader(this.params, ContentTypes.json);
    return this.apiConnector.putJson(this.urlValue, content, params).then(x => x.json() as Promise<T>);
  }

  putOnly(content: any) {
    return this.apiConnector.putJson(this.urlValue, content, this.params);
  }

  putData(data?: BodyInit) {
    return this.apiConnector.put(this.urlValue, data, this.params);
  }

  patch<T>(content: any): Promise<T> {
    const params = appendAcceptHeader(this.params, ContentTypes.json);
    return this.apiConnector.patchJson(this.urlValue, content, params).then(x => x.json() as Promise<T>);
  }

  patchOnly(content: any) {
    return this.apiConnector.patchJson(this.urlValue, content, this.params);
  }

  patchData(data?: BodyInit) {
    return this.apiConnector.patch(this.urlValue, data, this.params);
  }

  delete(content?: any) {
    return content
      ? this.apiConnector.deleteJson(this.urlValue, content, this.params)
      : this.apiConnector.delete(this.urlValue, undefined, this.params);
  }

  withBaseUrl(url: string) {
    this.urlValue = url;
    return this;
  }

  getQueryString(query: StringifiableRecord, queryStringOptions?: StringifyOptions) {
    return stringify(query, queryStringOptions ?? this.queryStringOptions ?? RestRequestBuilder.DefaultQueryStringOptions);
  }

  appendQuery(url: string, query?: StringifiableRecord, queryStringOptions?: StringifyOptions) {
    if (!query) {
      return url;
    }

    const queryString = typeof query === "string" ? query : this.getQueryString(query, queryStringOptions);
    return `${url}?${queryString}`;
  }
}
