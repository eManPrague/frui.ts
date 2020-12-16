import { Textbox } from "@frui.ts/htmlcontrols";
import { ViewComponent } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";
import TodoListViewModel from "../../viewModels/todoListViewModel";
import { onEnterHandler } from "../helpers";

const Header: ViewComponent<TodoListViewModel> = observer(({ vm }) => (
  <header className="header">
    <h1>{vm.name}</h1>
    <Textbox
      target={vm.newItem}
      property="title"
      className="new-todo"
      placeholder="What needs to be done?"
      autoFocus
      onKeyDown={onEnterHandler(vm.addItem)}
    />
  </header>
));

export default Header;
