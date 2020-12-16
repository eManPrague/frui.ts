import { ViewComponent } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";
import TodoListViewModel from "../../viewModels/todoListViewModel";
import { pluralize } from "../helpers";

const Footer: ViewComponent<TodoListViewModel> = observer(({ vm }) => {
  const getFilterClass = (filter: string) => (vm.filter === filter ? "selected" : undefined);

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{vm.totalIncomplete}</strong> {pluralize(vm.totalIncomplete, "item")} left
      </span>

      <ul className="filters">
        <li>
          <a className={getFilterClass("all")} href="#/">
            All
          </a>
        </li>
        <li>
          <a className={getFilterClass("active")} href="#/active">
            Active
          </a>
        </li>
        <li>
          <a className={getFilterClass("completed")} href="#/completed">
            Completed
          </a>
        </li>
      </ul>
      {vm.canDeleteCompleted && (
        <button className="clear-completed" onClick={vm.deleteCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
});

export default Footer;
