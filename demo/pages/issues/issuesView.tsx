import Pager from "@demo/controls/pager";
import SortingHeader from "@demo/controls/sortingHeader";
import { Observer, observer } from "mobx-react-lite";
import * as React from "react";
import IssuesViewModel from "./issuesViewModel";

const Filter: React.FunctionComponent<{ vm: IssuesViewModel }> = ({ vm }) => (
    <div>
        <button className="btn btn-primary mb-4" onClick={vm.loadData}>Load</button>
    </div>
);

const Pagination: React.FunctionComponent<{ vm: IssuesViewModel }> = observer(({ vm }) => (
    !vm.pageInfo ? null : <Pager paging={vm.pageInfo} filter={vm.filter} onPageChanged={vm.loadData} />
));

const DataTable: React.FunctionComponent<{ vm: IssuesViewModel }> = observer(({ vm }) => (
    !vm.items ? null : (
        <table className="table table-hover">
            <thead className="thead-light">
                <tr>
                    <SortingHeader column="id" filter={vm.filter} onSortChanged={vm.loadData}>ID</SortingHeader>
                    <SortingHeader column="project" filter={vm.filter} onSortChanged={vm.loadData}>Project</SortingHeader>
                    <SortingHeader column="subject" filter={vm.filter} onSortChanged={vm.loadData}>Subject</SortingHeader>
                </tr>
            </thead>
            <tbody>
                {vm.items.map(issue =>
                    <tr key={issue.id}>
                        <th scope="row">{issue.id}</th>
                        <td>{issue.project.name}</td>
                        <td>{issue.subject}</td>
                    </tr>)}
            </tbody>
        </table>
    )
));

const IssuesView: React.FunctionComponent<{ vm: IssuesViewModel }> = ({ vm }) => (
    <div>
        <Filter vm={vm} />
        <Pagination vm={vm} />
        <DataTable vm={vm} />
    </div>
);
export default IssuesView;
