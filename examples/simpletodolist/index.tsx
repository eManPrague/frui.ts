import * as React from "React";
import * as ReactDOM from "react-dom";
import TodoListViewModel from "./viewModels/todoListViewModel";
import TodoListView from "./views/todoListView";
import "todomvc-app-css/index.css";

const viewModel = new TodoListViewModel();
ReactDOM.render(<TodoListView vm={viewModel} />, document.getElementById("root"));
