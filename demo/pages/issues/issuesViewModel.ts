import { IssuesRepository } from "@demo/dataAccess/issuesRepository";
import { Issue, IssuesQuery } from "@demo/entities/issue";
import { SortingDirection } from "@src/data/sortingDirection";
import { IPagingFilter } from "@src/data/types";
import ListViewModel from "@src/viewModels/listViewModel";
import { action, observable } from "mobx";

export default class IssuesViewModel extends ListViewModel<Issue> {
    @observable public filter: IPagingFilter = {
        offset: 0,
        limit: 30,
        sortColumn: null,
        sortDirection: SortingDirection.Ascending,
    };

    constructor(private issuesRepository: IssuesRepository) {
        super();
    }

    @action.bound public loadData() {
        this.issuesRepository.getAllIssues(this.filter).then(this.setData);
    }
}
