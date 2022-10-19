import { registerViewComponent } from "@frui.ts/views";
import React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { List } from "./List";
import ListViewModel from "./todoListViewModel";

export const TodoListView = registerViewComponent(ListViewModel, vm => {
  return (
    <>
      <Header vm={vm} />
      {!!vm.list.length && <List vm={vm} />}
      {!!vm.list.length && <Footer vm={vm} />}
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Template by <a href="http://sindresorhus.com">Sindre Sorhus</a>
        </p>
      </footer>
    </>
  );
});
