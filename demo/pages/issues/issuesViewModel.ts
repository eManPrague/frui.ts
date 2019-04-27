import { IssuesFilter, IssuesRepository } from "@demo/dataAccess/issuesRepository";
import { Issue, IssuesQuery } from "@demo/entities/issue";
import { Project } from "@demo/entities/project";
import { ISelectItem } from "@src/controls/types";
import { SortingDirection } from "@src/data/sortingDirection";
import { IPagingFilter, PagedQueryResult } from "@src/data/types";
import { attachAutomaticDirtyWatcher } from "@src/dirtycheck";
import { IHasDirtyWatcher } from "@src/dirtycheck/types";
import FilteredListViewModel from "@src/viewModels/filteredListViewModel";
import ListViewModel from "@src/viewModels/listViewModel";
import { action, observable, toJS } from "mobx";

export default class IssuesViewModel extends FilteredListViewModel<Issue, IssuesFilter> {
    @observable public projects: ISelectItem[];

    constructor(private issuesRepository: IssuesRepository) {
        super();

        this.loadCodebooks();
        this.applyFilterAndLoad();
    }

    @action.bound public loadData() {
        this.issuesRepository.getAllIssues(this.appliedFilter, this.pagingFilter).then(this.setData);
    }

    protected resetFilterValues(filter: IssuesFilter) {
        filter.issue_id = null;
        filter.project_id = null;
        filter.subject = null;
    }

    private loadCodebooks() {
        return this.issuesRepository.getAllProjects({ sortColumn: "name", limit: 999, offset: 0 }).then(this.setProjects);
    }

    @action.bound private setProjects(data: PagedQueryResult<Project>) {
        this.projects = data[0].map(x => ({ value: x.id, label: x.name }));
    }
}
