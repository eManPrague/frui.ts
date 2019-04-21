import { IRedminePageInfo } from "@demo/entities/redminePageInfo";
import { IPagingInfo } from "@src/data/types";
import { RedmineRequestBuilder } from "./redmineRequestBuilder";

export class RepositoryBase {
  constructor(protected apiFactory: () => RedmineRequestBuilder) {
  }

}

export function extractPagingInfo(queryResult: IRedminePageInfo): IPagingInfo {
  return {
    totalItems: queryResult.total_count,
    offset: queryResult.offset,
    limit: queryResult.limit,
  };
}
