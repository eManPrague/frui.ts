import { ScreenBase } from "@frui.ts/screens";
import { action, computed, observable } from "mobx";
import TodoItem from "../models/todoItem";
import { v4 as uuidv4 } from "uuid";

type FilterType = "all" | "completed" | "active";

export default class TodoListViewModel extends ScreenBase {
  @observable list: TodoItem[] = [];
  @observable newItem: TodoItem;
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
    super();
    this.setNewItem();

    this.nameValue = "TODO List";
  }

  @action private setNewItem() {
    this.newItem = { id: uuidv4(), title: "", completed: false };
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

  @action.bound
  navigate(path: string) {
    switch (path) {
      case "completed":
      case "active":
        this.filter = path;
        break;
      default:
        this.filter = "all";
        break;
    }
  }
}
