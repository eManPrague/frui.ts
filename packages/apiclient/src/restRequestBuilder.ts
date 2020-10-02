import { IApiConnector } from "./types";

const cleanupRegex = /\/+$/g; // removes trailing slash

function getValueForUri(input: any) {
  if (input instanceof Date) {
    return input.toISOString();
  } else {
    return input;
  }
}

function getQueryString(query: any) {
  return Object.keys(query)
    .filter(prop => query[prop] || query[prop] === 0)
    .map(prop => `${encodeURIComponent(prop)}=${encodeURIComponent(getValueForUri(query[prop]))}`)
    .join("&");
}

const jsonContentType = "application/json,text/json";

export function appendAcceptJsonHeader(params?: RequestInit): RequestInit {
  return {
    ...params,
    headers: {
      ...(params || {}).headers,
      Accept: jsonContentType,
    },
  };
}

/** Fluent URL builder that makes the network call with the underlying IApiConnector */
export class RestRequestBuilder {
  protected urlValue: string;

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
      this.urlValue += "/" + id;
    }
    return this;
  }

  get<T>(queryParams?: any): Promise<T> {
    const requestUrl = this.appendQuery(this.urlValue, queryParams);
    const params = appendAcceptJsonHeader(this.params);
    return this.apiConnector.get(requestUrl, params).then(x => x.json());
  }

  getRaw(queryParams?: any) {
    const requestUrl = this.appendQuery(this.urlValue, queryParams);
    return this.apiConnector.get(requestUrl, this.params);
  }

  post<T>(content: any): Promise<T> {
    const params = appendAcceptJsonHeader(this.params);
    return this.apiConnector.postJson(this.urlValue, content, params).then(x => x.json());
  }

  postOnly(content: any) {
    return this.apiConnector.postJson(this.urlValue, content, this.params);
  }

  postData(data?: BodyInit) {
    return this.apiConnector.post(this.urlValue, data, this.params);
  }

  put<T>(content: any): Promise<T> {
    const params = appendAcceptJsonHeader(this.params);
    return this.apiConnector.putJson(this.urlValue, content, params).then(x => x.json());
  }

  putOnly(content: any) {
    return this.apiConnector.putJson(this.urlValue, content, this.params);
  }

  putData(data?: BodyInit) {
    return this.apiConnector.put(this.urlValue, data, this.params);
  }

  patch<T>(content: any): Promise<T> {
    const params = appendAcceptJsonHeader(this.params);
    return this.apiConnector.patchJson(this.urlValue, content, params).then(x => x.json());
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

  protected appendQuery(url: string, query?: any) {
    return query ? `${url}?${getQueryString(query)}` : url;
  }
}

export function appendUrl(base: string, ...segments: any[]) {
  let result = base.replace(cleanupRegex, "");
  segments.forEach(x => {
    result += "/" + x;
  });
  return result;
}
