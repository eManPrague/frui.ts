import { BusyWatcher } from "@frui.ts/screens";
import { createDataIdHandler, registerView } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { DropDown } from "../../controls/dropDown";
import FormField from "../../controls/formField";
import Pager from "../../controls/pager";
import SortingHeader from "../../controls/sortingHeader";
import { TextBox } from "../../controls/textBox";
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
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody>
                {vm.items.map(issue =>
                    <tr key={issue.id}>
                        <th scope="row">{issue.id}</th>
                        <td>{issue.project.name}</td>
                        <td>{issue.subject}</td>
                        <td><button className="btn btn-link p-0" data-id={issue.id} onClick={createDataIdHandler(vm.openDetail)}>Open</button> </td>
                    </tr>)}
            </tbody>
        </table>
    )
));

const LoadingOverlay: React.FunctionComponent<{ busyWatcher: BusyWatcher }> = observer(({ busyWatcher }) => (
    !busyWatcher.isBusy ? null : (
        <div className="text-center position-absolute w-100 h-100" style={{ backgroundColor: "rgba(100, 100, 100, .2)", zIndex: 2 }}>
            <div className="spinner-border m-5" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
));

const LoadingIndicator: React.FunctionComponent<{ busyWatcher: BusyWatcher }> = observer(({ busyWatcher }) => (
    !busyWatcher.isBusy ? null : (
        <div className="fixed-top text-right">
            <div className="spinner-border m-2" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
));

const IssuesView: React.FunctionComponent<{ vm: IssuesViewModel }> = ({ vm }) => (
    <div>
        <h1>Redmine Issues</h1>

        <Filter vm={vm} />

        <div className="position-relative">
            <LoadingOverlay busyWatcher={vm.busyWatcher} />
            <Pagination vm={vm} />
            <DataTable vm={vm} />
        </div>

        <LoadingIndicator busyWatcher={vm.busyWatcher} />
    </div>
);
export default registerView(IssuesView, IssuesViewModel);
