import { Checkbox, Textbox } from "@frui.ts/htmlcontrols";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { onEnterHandler } from "../helpers";
import type TodoItem from "../models/todoItem";
import type TodoListViewModel from "./viewModel";

export const Item: React.FunctionComponent<{ vm: TodoListViewModel; item: TodoItem }> = observer(({ vm, item }) => {
  if (vm.editedItem === item) {
    const closeEdit = () => vm.editItem();
    return (
      <li className="editing">
        <Textbox
          className="edit"
          target={item}
          property="title"
          autoFocus
          onBlur={closeEdit}
          onKeyDown={onEnterHandler(closeEdit)}
        />
      </li>
    );
  } else {
    return (
      <li className={item.completed ? "completed" : undefined}>
        <div className="view">
          <Checkbox className="toggle" target={item} property="completed" />
          <label onDoubleClick={() => vm.editItem(item)}>{item.title}</label>
          <button className="destroy" onClick={() => vm.deleteItem(item)}></button>
        </div>
      </li>
    );
  }
});
