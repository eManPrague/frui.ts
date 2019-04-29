import { IApiConnector, IRequestBuilder } from "./types";

const cleanupRegex = /\/+$/g; // removes trailing slash

export class RestRequestBuilder implements IRequestBuilder {
  protected url: string;

  constructor(protected apiConnector: IApiConnector, baseUrl: string, protected params: RequestInit) {
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

  get<T>() {
    return this.apiConnector.getJson<T>(this.url, this.params);
  }

  protected combineUrl(url: string, query?: any) {
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
  }
  else {
    return input;
  }
}
