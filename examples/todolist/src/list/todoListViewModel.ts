import type { IViewModel } from "@frui.ts/views";
import { type RouteMatch } from "@frui.ts/views";
import { action, computed, makeObservable, observable } from "mobx";
import { v4 as uuid } from "uuid";
import { type TodoItem } from "../models/todoItem";

type FilterType = "all" | "completed" | "active";

export default class TodoListViewModel implements IViewModel {
  name = "TODO List";
  @observable list: TodoItem[] = [];
  @observable newItem!: TodoItem;
  @observable editedItem?: TodoItem;

  @observable filter: FilterType = "all";

  @computed get filteredList() {
    switch (this.filter) {
      case "completed":
        return this.list.filter(x => x.completed);
      case "active":
        return this.list.filter(x => !x.completed);
      default:
        return this.list;
    }
  }

  @computed get isAllCompleted() {
    return this.list.every(x => x.completed);
  }

  @computed get totalIncomplete() {
    return this.list.filter(x => !x.completed).length;
  }

  constructor() {
    makeObservable(this);
  }

  onInitialize() {
    this.setNewItem();
  }

  @action onNavigate(routeMatch: RouteMatch) {
    console.log("navigate", routeMatch.params, routeMatch.pathname, routeMatch);
    // TODO set filter
  }

  @action private setNewItem() {
    this.newItem = { id: uuid(), title: "", completed: false };
  }

  @action.bound addItem() {
    const title = this.newItem.title.trim();
    if (title) {
      this.newItem.title = title;
      this.list.push(this.newItem);
      this.setNewItem();
    }
  }

  @action.bound deleteItem(item: TodoItem) {
    const index = this.list.indexOf(item);
    this.list.splice(index, 1);
  }

  @action.bound editItem(item?: TodoItem) {
    this.editedItem = item;
  }

  @computed get canDeleteCompleted() {
    return this.list.some(x => x.completed);
  }

  @action.bound deleteCompleted() {
    this.list = this.list.filter(x => !x.completed);
  }

  @action.bound toggleAll() {
    const newValue = !this.isAllCompleted;
    this.list.forEach(x => (x.completed = newValue));
  }
}
