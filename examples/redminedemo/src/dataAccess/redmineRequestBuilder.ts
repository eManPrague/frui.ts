import { RestRequestBuilder } from "@frui.ts/apiclient";
import { IRedminePageRequest } from "../entities/redminePageRequest";

export class RedmineRequestBuilder extends RestRequestBuilder {
  get<T>(filter?: IRedminePageRequest): Promise<T> {
    const fullUrl = this.appendQuery(this.url + ".json", filter);
    return this.apiConnector.get(fullUrl, this.params).then(x => x.json());
  }
}
