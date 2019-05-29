import { IPagingFilter, PagedQueryResult, SortingDirection } from "@frui.ts/data";
import { Issue, IssuesQuery } from "../entities/issue";
import { Project, ProjectsQuery } from "../entities/project";
import { IRedminePageRequest } from "../entities/redminePageRequest";
import { extractPagingInfo, RepositoryBase } from "./repositoryBase";

// tslint:disable-next-line: interface-name
export interface IssuesFilter {
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

type AsyncQueryResult<T> = Promise<PagedQueryResult<T>>;

export class IssuesRepository extends RepositoryBase {
  getAllProjects(paging: IPagingFilter): AsyncQueryResult<Project> {
    const requestFilter = createRequestFilter(null, paging) as any;
    return this.apiFactory().all("projects").get<ProjectsQuery>(requestFilter).then(data => [data.projects, extractPagingInfo(data)]);
  }

  getAllIssues(filter: IssuesFilter, paging: IPagingFilter): AsyncQueryResult<Issue> {
    const requestFilter = createRequestFilter(filter, paging) as any;
    requestFilter.subject = filter.subject && ("~" + filter.subject.trim());

    return this.apiFactory().all("issues").get<IssuesQuery>(requestFilter).then(data => [data.issues, extractPagingInfo(data)]);
  }

  getIssueDetail(id: number) {
    return this.apiFactory().one("issues", id).get<{ issue: Issue }>().then(x => x.issue);
  }
}

function createRequestFilter(inputFilter: any, paging: IPagingFilter): IRedminePageRequest {
  const { sortColumn, sortDirection, ...restPaging } = paging;
  const resultFilter = Object.assign({}, inputFilter, restPaging);

  if (sortColumn) {
    resultFilter.sort = `${sortColumn}:${sortDirection === SortingDirection.Descending ? "desc" : "asc"}`;
  }

  return resultFilter;
}
