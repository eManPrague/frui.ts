import { IssuesRepository } from "@demo/dataAccess/issuesRepository";
import { RedmineRequestBuilder } from "@demo/dataAccess/redmineRequestBuilder";
import { FetchApiConnector } from "@src/communication/fetchApiConnector";
import View from "@src/views/view";
import * as React from "react";
import "./issuesView"; // needed to register views. TODO
import IssuesViewModel from "./issuesViewModel";

const apiFactory = () => {
    const token = (window as any).apiToken;
    const url = (window as any).apiUrl;

    const apiConnector = new FetchApiConnector();
    const params: RequestInit = {
        headers: {
            "X-Redmine-API-Key": token,
        },
    };
    return new RedmineRequestBuilder(apiConnector, url, params);
};

const IssuesPage: React.FunctionComponent = props => {
    const issuesRepository = new IssuesRepository(apiFactory);
    const viewModel = new IssuesViewModel(issuesRepository);

    return <View vm={viewModel} />;
};

export default IssuesPage;
