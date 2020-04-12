import * as React from "react";
import * as ReactDOM from "react-dom";
import TodoListViewModel from "./viewModels/todoListViewModel";
import TodoListView from "./views/todoListView";
import "todomvc-app-css/index.css";
import { UrlNavigationAdapter } from "@frui.ts/screens";

const viewModel = new TodoListViewModel();

const urlAdapter = new UrlNavigationAdapter(viewModel);
urlAdapter.start();

ReactDOM.render(<TodoListView vm={viewModel} />, document.getElementById("root"));
