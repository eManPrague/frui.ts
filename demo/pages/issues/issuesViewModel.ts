import { IssuesFilter, IssuesRepository } from "@demo/dataAccess/issuesRepository";
import { Issue } from "@demo/entities/issue";
import { Project } from "@demo/entities/project";
import BusyWatcher from "@src/controls/busyWatcher";
import { ISelectItem } from "@src/controls/types";
import { PagedQueryResult } from "@src/data/types";
import ListDetailViewModel from "@src/viewModels/listDetailViewModel";
import { action, observable, toJS } from "mobx";
import IssueDetailViewModel from "./issueDetailViewModel";

export default class IssuesViewModel extends ListDetailViewModel<Issue, IssuesFilter, IssueDetailViewModel> {
    @observable projects: ISelectItem[];
    busyWatcher = new BusyWatcher();

    constructor(private issuesRepository: IssuesRepository) {
        super();

        this.loadCodebooks();
        this.applyFilterAndLoad();
    }

    @action.bound loadData() {
        return this.busyWatcher.watch(
            this.issuesRepository.getAllIssues(this.appliedFilter, this.pagingFilter).then(this.setData));
    }

    openDetail(id: number) {
        alert(id);
    }

    protected resetFilterValues(filter: IssuesFilter) {
        filter.issue_id = null;
        filter.project_id = null;
        filter.subject = null;
    }

    private loadCodebooks() {
        return this.busyWatcher.watch(
            this.issuesRepository.getAllProjects({ sortColumn: "name", limit: 999, offset: 0 }).then(this.setProjects));
    }

    @action.bound private setProjects(data: PagedQueryResult<Project>) {
        this.projects = data[0].map(x => ({ value: x.id, label: x.name }));
    }
}
