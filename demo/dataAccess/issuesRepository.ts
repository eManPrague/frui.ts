import { Issue, IssuesQuery } from "@demo/entities/issue";
import { IRedminePageInfo } from "@demo/entities/redminePageInfo";
import { IRedminePageRequest } from "@demo/entities/redminePageRequest";
import { SortingDirection } from "@src/data/sortingDirection";
import { IPagingFilter, IPagingInfo } from "@src/data/types";
import { extractPagingInfo, RepositoryBase } from "./repositoryBase";

// tslint:disable-next-line: interface-name
export interface IssuesFilter extends IPagingFilter {
  issue_id?: number | string;
  project_id?: number;
  subproject_id?: number;
  tracker_id?: number;
  status_id?: number;
  assigned_to_id?: number;
  parent_id?: number;
  created_on?: string;
  updated_on?: string;
  subject?: string;
}

type AsyncQueryResult<T> = Promise<[T[], IPagingInfo]>;

export class IssuesRepository extends RepositoryBase {
  public getAllIssues(filter?: IssuesFilter): AsyncQueryResult<Issue> {
    const requestFilter = getFilter(filter) as any;
    requestFilter.subject = filter.subject && ("~" + filter.subject.trim());

    return this.apiFactory().all("issues").get<IssuesQuery>(requestFilter).then(data => [data.issues, extractPagingInfo(data)]);
  }

  public getIssueDetail(id: number) {
    return this.apiFactory().one("issues", id).get<{ issue: Issue }>().then(x => x.issue);
  }
}

function getFilter(inputFilter: any): IRedminePageRequest {
  const { sortColumn, sortDirection, ...rest } = inputFilter;

  if (sortColumn) {
    rest.sort = `${sortColumn}:${sortDirection === SortingDirection.Descending ? "desc" : "asc"}`;
  }

  return rest;
}
