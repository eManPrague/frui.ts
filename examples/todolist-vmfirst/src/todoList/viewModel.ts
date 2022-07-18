import { NavigationContext, ScreenBase, SimpleScreenNavigator } from "@frui.ts/screens";
import type { HasLifecycleEvents } from "@frui.ts/screens/dist/screens/hasLifecycleHandlers";
import { action, computed, observable, makeObservable } from "mobx";
import { v4 as uuid } from "uuid";
import TodoItem from "../models/todoItem";

type FilterType = "all" | "completed" | "active";

export default class TodoListViewModel extends ScreenBase implements HasLifecycleEvents {
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
    super();

    makeObservable(this);

    this.navigator = new SimpleScreenNavigator(this, "");
    this.setNewItem();
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

  @action.bound
  onNavigate(context: NavigationContext) {
    const action = context.path[0]?.name;
    switch (action) {
      case "completed":
      case "active":
        this.filter = action;
        break;
      default:
        this.filter = "all";
        break;
    }

    this.navigator.navigationName = this.filter;
  }
}
