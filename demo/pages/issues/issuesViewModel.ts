import { IssuesRepository } from "@demo/dataAccess/issuesRepository";
import { IssuesQuery } from "@demo/entities/issue";
import { action, observable } from "mobx";

export default class IssuesViewModel {
    @observable public data: IssuesQuery;

    constructor(private issuesRepository: IssuesRepository) {
    }

    @action.bound public loadData() {
        this.issuesRepository.getAllIssues().then(this.setData);
    }

    @action.bound private setData(data: IssuesQuery) {
        this.data = data;
    }
}
