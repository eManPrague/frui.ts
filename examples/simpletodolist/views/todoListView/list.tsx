import { ViewComponent } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import * as React from "React";
import TodoListViewModel from "../../viewModels/todoListViewModel";
import Item from "./item";

const List: ViewComponent<TodoListViewModel> = observer(({ vm }) => (
  <section className="main">
    <input id="toggle-all" className="toggle-all" type="checkbox" checked={vm.isAllCompleted} onChange={vm.toggleAll} />
    <label htmlFor="toggle-all">Mark all as complete</label>
    <ul className="todo-list">
      {vm.filteredList.map(item => (
        <Item key={item.id} item={item} vm={vm} />
      ))}
    </ul>
  </section>
));

export default List;
