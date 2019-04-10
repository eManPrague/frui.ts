import { RedmineRequestBuilder } from "./redmineRequestBuilder";

export class RepositoryBase {
  constructor(protected apiFactory: () => RedmineRequestBuilder) {
  }
}
