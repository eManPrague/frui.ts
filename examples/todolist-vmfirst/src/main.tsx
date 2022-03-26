import { getNavigator } from "@frui.ts/screens";
import { View } from "@frui.ts/views";
import React from "react";
import ReactDOM from "react-dom";
import "todomvc-app-css/index.css";
import HistoryRouter from "./historyRouter";
import "./index.css";
import services from "./services";
import TodoListViewModel from "./todoList/viewModel";
import "./viewsRegistry";

const rootViewModel = new TodoListViewModel();

services.router = new HistoryRouter(getNavigator(rootViewModel));
void services.router.initialize();

ReactDOM.render(
  <React.StrictMode>
    <View vm={rootViewModel} />
  </React.StrictMode>,
  document.getElementById("root")
);
