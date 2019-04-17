import { Observer } from "mobx-react-lite";
import * as React from "react";
import IssuesViewModel from "./issuesViewModel";

const IssuesView: React.FunctionComponent<{ vm: IssuesViewModel }> = ({ vm }) => (
    <div>
        <button className="btn btn-primary mb-4" onClick={vm.loadData}>Load</button>

        <Observer>{() => !vm.data ? null :
            <table className="table table-hover">
                <thead className="thead-light">
                    <tr>
                        <th>ID</th>
                        <th>Project</th>
                        <th>Subject</th>
                    </tr>
                </thead>
                <tbody>
                    {vm.data.issues.map(issue =>
                        <tr key={issue.id}>
                            <th scope="row">{issue.id}</th>
                            <td>{issue.project.name}</td>
                            <td>{issue.subject}</td>
                        </tr>)}
                </tbody>
            </table>
        }</Observer>
    </div>
);

export default IssuesView;
