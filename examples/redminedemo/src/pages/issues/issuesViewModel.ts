import { PagedQueryResult } from "@frui.ts/data";
import { FilteredListViewModel } from "@frui.ts/datascreens";
import { BusyWatcher } from "@frui.ts/screens";
import { ISelectItem } from "@frui.ts/views";
import { action, observable } from "mobx";
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

  @action.bound
  loadData() {
    return this.busyWatcher.watch(this.issuesRepository.getAllIssues(this.appliedFilter, this.pagingFilter).then(this.setData));
  }

  openDetail(id: number) {
    alert(id);
  }

  protected resetFilterValues(filter: IssuesFilter) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    filter.issue_id = undefined;
    // eslint-disable-next-line @typescript-eslint/camelcase
    filter.project_id = undefined;
    filter.subject = undefined;
  }

  private loadCodebooks() {
    return this.busyWatcher.watch(
      this.issuesRepository.getAllProjects({ sortColumn: "name", limit: 999, offset: 0 }).then(this.setProjects)
    );
  }

  @action.bound
  private setProjects(data: PagedQueryResult<Project>) {
    this.projects = data[0].map(x => ({ value: x.id, label: x.name }));
  }

  protected findNavigationChild(navigationName: string) {
    return undefined;
  }
}
