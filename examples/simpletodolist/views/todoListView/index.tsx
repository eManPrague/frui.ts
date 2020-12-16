import { ViewComponent } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";
import TodoListViewModel from "../../viewModels/todoListViewModel";
import Footer from "./footer";
import Header from "./header";
import List from "./list";

const TodoListView: ViewComponent<TodoListViewModel> = observer(({ vm }) => (
  <>
    <section className="todoapp">
      <Header vm={vm} />
      {!!vm.list.length && <List vm={vm} />}
      {!!vm.list.length && <Footer vm={vm} />}
    </section>
    <footer className="info">
      <p>Double-click to edit a todo</p>
      <p>
        Template by <a href="http://sindresorhus.com">Sindre Sorhus</a>
      </p>
    </footer>
  </>
));

export default TodoListView;
