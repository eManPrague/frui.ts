import { Textbox } from "@frui.ts/htmlcontrols";
import { createViewComponent } from "@frui.ts/views";
import * as React from "react";
import { onEnterHandler } from "../helpers";
import type TodoListViewModel from "./viewModel";

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
