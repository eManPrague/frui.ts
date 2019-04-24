import { IssuesRepository } from "@demo/dataAccess/issuesRepository";
import { RedmineRequestBuilder } from "@demo/dataAccess/redmineRequestBuilder";
import { FetchApiConnector } from "@src/communication/fetchApiConnector";
import * as React from "react";
import IssuesView from "./issuesView";
import IssuesViewModel from "./issuesViewModel";

const apiFactory = () => {
    const token = (window as any).apiToken;
    const url = (window as any).apiUrl;

    const apiConnector = new FetchApiConnector();
    const params: RequestInit = {
        headers: {
            Authorization: `Basic ${btoa(`${token}:pass`)}`,
        },
    };
    return new RedmineRequestBuilder(apiConnector, url, params);
};

const IssuesPage: React.FunctionComponent = (props) => {
    const issuesRepository = new IssuesRepository(apiFactory);
    const viewModel = new IssuesViewModel(issuesRepository);
    return <IssuesView vm={viewModel} />;
};

export default IssuesPage;
