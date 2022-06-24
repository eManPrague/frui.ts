import { appendAcceptHeader, ContentTypes, RestRequestBuilder } from "@frui.ts/apiclient";
import type { PagedQueryResult } from "@frui.ts/data/";
import type { ClassConstructor } from "class-transformer";
import { isObservable, toJS } from "mobx";
import { deserialize, deserializeArray } from "../utils";
import type { PagedResult } from "./apiModels";

RestRequestBuilder.DefaultQueryStringOptions = {
  skipNulls: true,
  arrayFormat: "repeat",
  allowDots: true,
};

export default class DeserializingRequestBuilder extends RestRequestBuilder {
  getEntity<T>(returnType: ClassConstructor<T>, queryParams?: any): Promise<T> {
    const requestUrl = this.appendQuery(this.url, queryParams);
    const params = appendAcceptHeader(this.params, ContentTypes.json);
    return this.apiConnector
      .get(requestUrl, params)
      .then(x => x.text())
      .then(x => deserialize(returnType, x));
  }

  getEntities<T>(returnType: ClassConstructor<T>, queryParams?: any): Promise<T[]> {
    const requestUrl = this.appendQuery(this.url, queryParams);
    const params = appendAcceptHeader(this.params, ContentTypes.json);
    return this.apiConnector
      .get(requestUrl, params)
      .then(x => x.text())
      .then(x => deserializeArray(returnType, x));
  }

  postEntity<T>(content: any, returnType: ClassConstructor<T>): Promise<T>;
  postEntity(content: any): Promise<Response>;

  postEntity<T>(content: any, returnType?: ClassConstructor<T>): Promise<T | Response> {
    const params = appendAcceptHeader(this.params, ContentTypes.json);
    const promise = this.apiConnector.postObject(this.url, content, params);

    if (returnType) {
      return promise.then(x => x.text()).then(x => deserialize(returnType, x));
    } else {
      return promise;
    }
  }

  async postPagedEntityQuery<TEntity, TPayload extends PagedResult<TEntity> = PagedResult<TEntity>>(
    content: any,
    payloadType: ClassConstructor<TPayload>
  ): Promise<PagedQueryResult<TEntity>> {
    const payload = await this.postEntity(content, payloadType);

    const { total: totalItems, offset, limit } = payload.metadata.pagination;
    return [payload.items, { totalItems, offset, limit }];
  }

  putEntity<T>(content: any, returnType: ClassConstructor<T>): Promise<T>;
  putEntity(content: any): Promise<Response>;

  putEntity<T>(content: any, returnType?: ClassConstructor<T>): Promise<T | Response> {
    const params = appendAcceptHeader(this.params, ContentTypes.json);
    const promise = this.apiConnector.putObject(this.url, content, params);

    if (returnType) {
      return promise.then(x => x.text()).then(x => deserialize(returnType, x));
    } else {
      return promise;
    }
  }

  patchEntity<T>(content: any, returnType: ClassConstructor<T>): Promise<T>;
  patchEntity(content: any): Promise<Response>;

  patchEntity<T>(content: any, returnType?: ClassConstructor<T>): Promise<T | Response> {
    const params = appendAcceptHeader(this.params, ContentTypes.json);
    const promise = this.apiConnector.patchObject(this.url, content, params);

    if (returnType) {
      return promise.then(x => x.text()).then(x => deserialize(returnType, x));
    } else {
      return promise;
    }
  }

  // 'qs' (query string serialization library) uses cached version of isArray function
  // and thus our monkey patched version is not applied. We need to handle observables manually.
  getQueryString(query: unknown, queryStringOptions?: any): string {
    const cleanedQuery = isObservable(query) ? toJS(query) : query;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return super.getQueryString(cleanedQuery, queryStringOptions);
  }
}
