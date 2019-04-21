import { IRedminePageRequest } from "@demo/entities/redminePageRequest";
import { RestRequestBuilder } from "@src/communication/restRequestBuilder";

export class RedmineRequestBuilder extends RestRequestBuilder {
  public get<T>(filter?: IRedminePageRequest): Promise<T> {
    const fullUrl = this.combineUrl(this.url + ".json", filter);
    return this.apiConnector.getJson<T>(fullUrl, this.params);
  }
}
