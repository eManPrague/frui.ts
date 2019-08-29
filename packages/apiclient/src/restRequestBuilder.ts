import { IApiConnector, IRequestBuilder } from "./types";

const cleanupRegex = /\/+$/g; // removes trailing slash

export class RestRequestBuilder implements IRequestBuilder {
  protected url: string;

  constructor(protected apiConnector: IApiConnector, baseUrl: string, protected params?: RequestInit) {
    this.url = baseUrl.replace(cleanupRegex, "");
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

  get<T>(queryParams?: any) {
    const requestUrl = this.appendQuery(this.url, queryParams);
    return this.apiConnector.getJson<T>(requestUrl, this.params);
  }

  post<T>(content: any) {
    return this.apiConnector.postJson<T>(this.url, content, this.params);
  }

  put<T>(content: any) {
    return this.apiConnector.putJson<T>(this.url, content, this.params);
  }

  patch<T>(content: any) {
    return this.apiConnector.patchJson<T>(this.url, content, this.params);
  }

  delete() {
    return this.apiConnector.delete(this.url, this.params);
  }

  protected appendQuery(url: string, query?: any) {
    return query ? `${url}?${getQueryString(query)}` : url;
  }
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
