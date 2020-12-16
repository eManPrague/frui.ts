import { UrlNavigationAdapter } from "@frui.ts/screens";
import React from "react";
import ReactDOM from "react-dom";
import "todomvc-app-css/index.css";
import TodoListViewModel from "./viewModels/todoListViewModel";
import TodoListView from "./views/todoListView";

const viewModel = new TodoListViewModel();

const urlAdapter = new UrlNavigationAdapter();
void urlAdapter.start(viewModel);

ReactDOM.render(<TodoListView vm={viewModel} />, document.getElementById("root"));
