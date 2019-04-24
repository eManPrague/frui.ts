import { IssuesFilter, IssuesRepository } from "@demo/dataAccess/issuesRepository";
import { Issue, IssuesQuery } from "@demo/entities/issue";
import { SortingDirection } from "@src/data/sortingDirection";
import { IPagingFilter } from "@src/data/types";
import ListViewModel from "@src/viewModels/listViewModel";
import { action, observable } from "mobx";

export default class IssuesViewModel extends ListViewModel<Issue> {
    @observable public filter: IssuesFilter;

    constructor(private issuesRepository: IssuesRepository) {
        super();

        this.resetFilter();
    }

    @action.bound public loadData() {
        this.issuesRepository.getAllIssues(this.filter).then(this.setData);
    }

    @action.bound public resetFilter() {
        this.filter = {
            offset: 0,
            limit: 30,
            sortColumn: "id",
            sortDirection: SortingDirection.Ascending,
        };

        this.loadData();
    }
}
