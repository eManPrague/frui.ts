import { IApiConnector } from "./types";

const cleanupRegex = /\/+$/g; // removes trailing slash

/** Fluent URL builder that makes the network call with the underlying IApiConnector */
export class RestRequestBuilder {
  protected url: string;

  constructor(protected apiConnector: IApiConnector, private baseUrl: string, protected params?: RequestInit) {
    this.reset();
  }

  reset() {
    this.url = this.baseUrl.replace(cleanupRegex, "");
  }

  all(path: string) {
    this.url += "/" + path;
    return this;
  }

  one(path: string, id?: any) {
    this.url += "/" + path;
    if (id !== undefined) {
      this.url += "/" + id;
    }
    return this;
  }

  get<T>(queryParams?: any): Promise<T> {
    const requestUrl = this.appendQuery(this.url, queryParams);
    const params = appendAcceptJsonHeader(this.params);
    return this.apiConnector.get(requestUrl, params).then(x => x.json());
  }

  getRaw(queryParams?: any) {
    const requestUrl = this.appendQuery(this.url, queryParams);
    return this.apiConnector.get(requestUrl, this.params);
  }

  post<T>(content: any): Promise<T> {
    const params = appendAcceptJsonHeader(this.params);
    return this.apiConnector.postJson(this.url, content, params).then(x => x.json());
  }

  postOnly(content: any) {
    return this.apiConnector.postJson(this.url, content, this.params);
  }

  postFormData(data: FormData) {
    return this.apiConnector.postFormData(this.url, data, this.params);
  }

  put<T>(content: any): Promise<T> {
    const params = appendAcceptJsonHeader(this.params);
    return this.apiConnector.putJson(this.url, content, params).then(x => x.json());
  }

  putOnly(content: any) {
    return this.apiConnector.putJson(this.url, content, this.params);
  }

  putFormData(data: FormData) {
    return this.apiConnector.putFormData(this.url, data, this.params);
  }

  patch<T>(content: any): Promise<T> {
    const params = appendAcceptJsonHeader(this.params);
    return this.apiConnector.patchJson(this.url, content, params).then(x => x.json());
  }

  patchOnly(content: any) {
    return this.apiConnector.patchJson(this.url, content, this.params);
  }

  delete() {
    return this.apiConnector.delete(this.url, this.params);
  }

  withBaseUrl(url: string) {
    this.url = url;
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

function getQueryString(query: any) {
  return Object.keys(query)
    .filter(prop => query[prop] || query[prop] === 0)
    .map(prop => `${encodeURIComponent(prop)}=${encodeURIComponent(getValueForUri(query[prop]))}`)
    .join("&");
}

function getValueForUri(input: any) {
  if (input instanceof Date) {
    return input.toISOString();
  } else {
    return input;
  }
}

const jsonContentType = "application/json,text/json";

function appendAcceptJsonHeader(params?: RequestInit) {
  return {
    ...params,
    headers: {
      ...(params || {}).headers,
      Accept: jsonContentType,
    },
  };
}
