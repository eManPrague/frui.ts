import { createViewComponent } from "@frui.ts/views";
import { Link } from "@tanstack/react-router";
import React from "react";
import { pluralize } from "../helpers";
import type TodoListViewModel from "./todoListViewModel";

export const Footer = createViewComponent<TodoListViewModel>(vm => {
  const getFilterClass = (filter: string) => (vm.filter === filter ? "selected" : undefined);

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{vm.totalIncomplete}</strong> {pluralize(vm.totalIncomplete, "item")} left
      </span>

      <ul className="filters">
        <li>
          <Link to="/" className={getFilterClass("all")}>
            All
          </Link>
        </li>
        <li>
          <Link to="/$filter" params={{ filter: "active" }} className={getFilterClass("active")}>
            Active
          </Link>
        </li>
        <li>
          <Link to="/$filter" params={{ filter: "completed" }} className={getFilterClass("completed")}>
            Completed
          </Link>
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
