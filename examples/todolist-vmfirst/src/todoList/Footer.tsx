import { createViewComponent } from "@frui.ts/views";
import * as React from "react";
import { pluralize } from "../helpers";
import services from "../services";
import type TodoListViewModel from "./viewModel";

export const Footer = createViewComponent<TodoListViewModel>(vm => {
  const getFilterClass = (filter: string) => (vm.filter === filter ? "selected" : undefined);

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{vm.totalIncomplete}</strong> {pluralize(vm.totalIncomplete, "item")} left
      </span>

      <ul className="filters">
        <li>
          <a className={getFilterClass("all")} {...services.router?.hrefParams("/")}>
            All
          </a>
        </li>
        <li>
          <a className={getFilterClass("active")} {...services.router?.hrefParams("/active")}>
            Active
          </a>
        </li>
        <li>
          <a className={getFilterClass("completed")} {...services.router?.hrefParams("/completed")}>
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
