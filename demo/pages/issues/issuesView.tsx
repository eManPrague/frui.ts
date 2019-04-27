import FormField from "@demo/controls/formField";
import Pager from "@demo/controls/pager";
import SortingHeader from "@demo/controls/sortingHeader";
import { DropDown } from "@src/controls/dropDown";
import { TextBox } from "@src/controls/textBox";
import { Observer, observer } from "mobx-react-lite";
import * as React from "react";
import IssuesViewModel from "./issuesViewModel";

const Filter: React.FunctionComponent<{ vm: IssuesViewModel }> = observer(({ vm }) => vm.filter && (
    <fieldset>
        <legend>Filter</legend>
        <div className="form-row">
            <div className="col">
                <FormField label="Issue ID" target={vm.filter} property="issue_id" component={TextBox} controlId="filter_issueId" />
            </div>
            <div className="col">
                <FormField label="Project" target={vm.filter} property="project_id">
                    {(bindingProps, childProps) => <DropDown {...bindingProps} {...childProps} options={vm.projects} allowEmpty={true} />}
                </FormField>
            </div>
            <div className="col">
                <FormField label="Subject" target={vm.filter} property="subject" component={TextBox} controlId="filter_subject" />
            </div>
        </div>

        <div className="float-right">
            <button className="btn btn-secondary mb-4" onClick={vm.resetFilterAndLoad}>Reset</button> &nbsp;
            <button className="btn btn-primary mb-4" onClick={vm.applyFilterAndLoad}>Load</button>
        </div>
    </fieldset>
));

const Pagination: React.FunctionComponent<{ vm: IssuesViewModel }> = observer(({ vm }) => (
    !vm.currentPaging ? null : <Pager paging={vm.currentPaging} filter={vm.pagingFilter} onPageChanged={vm.loadData} />
));

const DataTable: React.FunctionComponent<{ vm: IssuesViewModel }> = observer(({ vm }) => (
    !vm.items ? null : (
        <table className="table table-hover">
            <thead className="thead-light">
                <tr>
                    <SortingHeader column="id" filter={vm.pagingFilter} onSortChanged={vm.loadData}>ID</SortingHeader>
                    <SortingHeader column="project" filter={vm.pagingFilter} onSortChanged={vm.loadData}>Project</SortingHeader>
                    <SortingHeader column="subject" filter={vm.pagingFilter} onSortChanged={vm.loadData}>Subject</SortingHeader>
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
        <h1>Redmine Issues</h1>

        <Filter vm={vm} />
        <Pagination vm={vm} />
        <DataTable vm={vm} />
    </div>
);
export default IssuesView;
