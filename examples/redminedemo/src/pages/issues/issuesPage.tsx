import { FetchApiConnector } from "@frui.ts/apiclient";
import { View } from "@frui.ts/views";
import * as React from "react";
import { IssuesRepository } from "../../dataAccess/issuesRepository";
import { RedmineRequestBuilder } from "../../dataAccess/redmineRequestBuilder";
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

  return <View vm={viewModel} useLifecycle={true} />;
};

export default IssuesPage;
