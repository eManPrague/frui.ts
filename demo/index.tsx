import * as React from "react";
import * as ReactDOM from "react-dom";
import "reflect-metadata";
import ConfigPage from "./pages/config/configPage";
import IssuesPage from "./pages/issues/issuesPage";

ReactDOM.render((
    <div className="container">
        <ConfigPage />
        <hr />
        <IssuesPage />
    </div>
), document.getElementById("application"));
