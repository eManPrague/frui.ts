import { IPageRequest } from "@demo/entities/pageRequest";
import { RestRequestBuilder } from "@src/communication/restRequestBuilder";

export class RedmineRequestBuilder extends RestRequestBuilder {
  public get<T>(filter?: IPageRequest): Promise<T> {
    const fullUrl = this.combineUrl(this.url + ".json", filter);
    return this.apiConnector.getJson<T>(fullUrl, this.params);
  }
}
