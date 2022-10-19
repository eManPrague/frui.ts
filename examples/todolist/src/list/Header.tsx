import { Textbox } from "@frui.ts/htmlcontrols";
import { createViewComponent } from "@frui.ts/views";
import React from "react";
import { onEnterHandler } from "../helpers";
import type TodoListViewModel from "./todoListViewModel";

export const Header = createViewComponent<TodoListViewModel>(vm => (
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
