# Simple TODO list example

# Tutorial steps

## 1. Initialize project

Let's create a new project for our TODO list app.

```
yarn add typescript parcel-bundler -D
yarn add react react-dom mobx mobx-react-lite yarn add @frui.ts/bootstrap @frui.ts/screens @frui.ts/views
```

`index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TODO list example</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="./index.tsx"></script>
  </body>
</html>
```

`index.tsx`
```tsx
document.write("Hello from TS!");
```

`package.json`
```json
  "scripts": {
    "start": "parcel index.html"
  },
```

If you run the application now with `yarn start`, you should see `Hello from TS!`.

## 2. Add the first ViewModel

Let's add our first view model and present it with a view.

`viewModels/todoListViewModel.ts`
```ts
import { ScreenBase } from "@frui.ts/screens";

export default class TodoListViewModel extends ScreenBase {
  constructor() {
    super();
    this.nameValue = "TODO List";
  }
}
```

`views/todoListView.tsx`
```tsx
import { ViewComponent } from "@frui.ts/views";
import React from "react";
import TodoListViewModel from "../viewModels/todoListViewModel";

const TodoListView: ViewComponent<TodoListViewModel> = ({ vm }) => (
  <>
    <h1>{vm.name}</h1>
  </>
);
```

`index.tsx`
```tsx
import React from "react";
import ReactDOM from "react-dom";
import TodoListViewModel from "./viewModels/todoListViewModel";
import TodoListView from "./views/todoListView";

const viewModel = new TodoListViewModel();
ReactDOM.render(<TodoListView vm={viewModel} />, document.getElementById("root"));
```

## 3. Add functionality to the VM

The plan is that our `ListViewModel` should publish a list of `TodoItem`s, handle user interaction, and do the respective filtering.

`models/todoItem.ts`
```ts
export default interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
}
```

Now, let's add the functionality we require from the view model:

- The VM should display a list of todo items

`viewModels/todoListViewModel.ts`
```ts
import { observable, action, computed } from "mobx";

export default class TodoListViewModel extends ScreenBase {
  @observable list: TodoItem[] = [];
  ...
}
```

- The VM should allow a new item to be edited. This item should be available when the VM is opened.

```
yarn add uuidv4
```

```ts
import { uuid } from "uuidv4";

...

@observable newItem: TodoItem;

constructor() {
  super();
  this.setNewItem();
}

@action private setNewItem() {
  this.newItem = { id: uuid(), title: "", completed: false };
}
```

- The VM should allow the new item to be added to the list. The title should be trimmed, and the item shall be added only if it is not empty.

```ts
@action.bound addItem() {
  const title = this.newItem.title.trim();
  if (title) {
    this.newItem.title = title;
    this.list.push(this.newItem);
    this.setNewItem();
  }
}
```

- The VM should allow existing item to be deleted

```ts
@action.bound deleteItem(item: TodoItem) {
  const index = this.list.indexOf(item);
  this.list.splice(index, 1);
}
```

- The VM should provide information whether all items are completed and allow changing of the state for all of them

```ts
@computed get isAllCompleted() {
  return this.list.every(x => x.completed);
}

@action.bound toggleAll() {
  const newValue = !this.isAllCompleted;
  this.list.forEach(x => (x.completed = newValue));
}
```

- The VM should display the number of incomplete items

```ts
@computed get totalIncomplete() {
  return this.list.filter(x => !x.completed).length;
}
```

- The VM should be able to delete all completed items

```ts
@computed get canDeleteCompleted() {
  return this.list.some(x => x.completed);
}

@action.bound deleteCompleted() {
  this.list = this.list.filter(x => !x.completed);
}
```

- The VM should provide filter of the items based on their state

```ts
type FilterType = "all" | "complete" | "incomplete";

...

@observable filter: FilterType = "all";

@computed get filteredList() {
  switch (this.filter) {
    case "complete":
      return this.list.filter(x => x.completed);
    case "incomplete":
      return this.list.filter(x => !x.completed);
    default:
      return this.list;
  }
}
```

- The VM should allow edit existing items

```ts
@action.bound editItem(item?: TodoItem) {
  this.editedItem = item;
}
```

## 4. Unit test the VM

```
yarn add jest ts-jest @types/jest -D
yarn ts-jest config:init
```

`package.json`
```json
"scripts": {
  "start": "parcel index.html",
  "test": "jest"
},
```

`viewModels/__tests__/todoListViewModel.test.ts`
```ts
import TodoListViewModel from "../todoListViewModel";

describe("TodoListViewModel", () => {
  it("should display list of todo items", () => {
    const vm = new TodoListViewModel();

    expect(vm.list).toBeDefined();
    expect(vm.list.length).toBeDefined();
  });
});
```
See the rest of the file in the [repository](viewModels/__tests__/todoListViewModel.test.ts).

## 5. Add view

Add some style

```
yarn add todomvc-app-css
```

`index.tsx`
```tsx
import "todomvc-app-css/index.css";
```

TODO describe views
