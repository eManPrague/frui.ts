import { Issue, IssuesQuery } from "@demo/entities/issue";
import { IPageRequest } from "@demo/entities/pageRequest";
import { RepositoryBase } from "./repositoryBase";

interface IssuesFilter extends IPageRequest {
  issue_id?: number | string;
  project_id?: number;
  subproject_id?: number;
  tracker_id?: number;
  status_id?: number;
  assigned_to_id?: number;
  parent_id?: number;
  created_on?: string;
  updated_on?: string;
}

export class IssuesRepository extends RepositoryBase {
  public getAllIssues(filter?: IssuesFilter) {
    return this.apiFactory().all("issues").get<IssuesQuery>(filter);
  }

  public getIssueDetail(id: number) {
    return this.apiFactory().one("issues", id).get<{ issue: Issue }>().then(x => x.issue);
  }
}
