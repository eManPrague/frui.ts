import { PagedQueryResult } from "@frui.ts/data";
import { FilteredListViewModel } from "@frui.ts/datascreens";
import { BusyWatcher } from "@frui.ts/screens";
import { ISelectItem } from "@frui.ts/views";
import { action, observable, toJS } from "mobx";
import { IssuesFilter, IssuesRepository } from "../../dataAccess/issuesRepository";
import { Issue } from "../../entities/issue";
import { Project } from "../../entities/project";
import IssueDetailViewModel from "./issueDetailViewModel";

export default class IssuesViewModel extends FilteredListViewModel<Issue, IssuesFilter, IssueDetailViewModel> {
  @observable projects: ISelectItem[];
  busyWatcher = new BusyWatcher();

  constructor(private issuesRepository: IssuesRepository) {
    super();

    this.loadCodebooks();
    this.applyFilterAndLoad();
  }

  @action.bound loadData() {
    return this.busyWatcher.watch(
      this.issuesRepository.getAllIssues(this.appliedFilter, this.pagingFilter).then(this.setData)
    );
  }

  openDetail(id: number) {
    alert(id);
  }

  protected resetFilterValues(filter: IssuesFilter) {
    filter.issue_id = null;
    filter.project_id = null;
    filter.subject = null;
  }

  protected findChild(navigationName: string) {
    return Promise.resolve(null);
  }

  private loadCodebooks() {
    return this.busyWatcher.watch(
      this.issuesRepository.getAllProjects({ sortColumn: "name", limit: 999, offset: 0 }).then(this.setProjects)
    );
  }

  @action.bound private setProjects(data: PagedQueryResult<Project>) {
    this.projects = data[0].map(x => ({ value: x.id, label: x.name }));
  }
}
