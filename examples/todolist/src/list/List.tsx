import { createViewComponent } from "@frui.ts/views";
import React from "react";
import { Item } from "./Item";
import type TodoListViewModel from "./todoListViewModel";

export const List = createViewComponent<TodoListViewModel>(vm => {
  return (
    <section className="main">
      <input id="toggle-all" className="toggle-all" type="checkbox" checked={vm.isAllCompleted} onChange={vm.toggleAll} />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {vm.filteredList.map(item => (
          <Item key={item.id} item={item} vm={vm} />
        ))}
      </ul>
    </section>
  );
});
