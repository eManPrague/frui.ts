/* eslint-disable @typescript-eslint/tslint/config */
import TodoListViewModel from "../todoListViewModel";

describe("TodoListViewModel", () => {
  it("should display list of todo items", () => {
    const vm = new TodoListViewModel();

    expect(vm.list).toBeDefined();
    expect(vm.list.length).toBeDefined();
  });

  it("should allow a new item to be edited", () => {
    const vm = new TodoListViewModel();

    vm.newItem.title = "Edited item";

    expect(vm.newItem.id).toBeDefined();
    expect(vm.newItem.title).toBe("Edited item");
    expect(vm.newItem.completed).toBeFalsy();
  });

  it("should allow the new item to be added to the list", () => {
    const vm = new TodoListViewModel();

    vm.newItem.id = "1";
    vm.newItem.title = "Edited item  ";
    vm.addItem();

    expect(vm.list).toContainEqual({ id: "1", title: "Edited item", completed: false });
    expect(vm.newItem.title).toBe("");
  });

  it("should not add the new item if it is empty", () => {
    const vm = new TodoListViewModel();

    vm.addItem();

    expect(vm.list).toHaveLength(0);
  });

  it("should allow existing item to be deleted", () => {
    const vm = new TodoListViewModel();
    const item = { id: "1", title: "Existing item", completed: true };

    vm.list.push(item);
    expect(vm.list).toHaveLength(1);

    vm.deleteItem(item);

    expect(vm.list).toHaveLength(0);
  });

  it("should provide an information that all items are completed", () => {
    const vm = new TodoListViewModel();
    vm.list.push({ id: "1", title: "Existing item", completed: true });

    expect(vm.isAllCompleted).toBeTruthy();
  });

  it("should provide an information that all items are completed", () => {
    const vm = new TodoListViewModel();
    vm.list.push({ id: "1", title: "Existing item", completed: false });

    expect(vm.isAllCompleted).toBeFalsy();
  });

  it("should toggle all items completed when some incomplete", () => {
    const vm = new TodoListViewModel();
    vm.list.push({ id: "1", title: "Existing item 1", completed: true });
    vm.list.push({ id: "2", title: "Existing item 2", completed: false });

    vm.toggleAll();

    for (let i = 0; i < vm.list.length; i++) {
      const item = vm.list[i];
      expect(item.completed).toBeTruthy();
    }
  });

  it("should toggle all items incomplete when all are completed", () => {
    const vm = new TodoListViewModel();
    vm.list.push({ id: "1", title: "Existing item 1", completed: true });
    vm.list.push({ id: "2", title: "Existing item 2", completed: true });

    vm.toggleAll();

    for (let i = 0; i < vm.list.length; i++) {
      const item = vm.list[i];
      expect(item.completed).toBeFalsy();
    }
  });

  it("should toggle all items completed when some incomplete", () => {
    const vm = new TodoListViewModel();

    expect(vm.totalIncomplete).toBe(0);

    vm.list.push({ id: "1", title: "Existing item 1", completed: false });
    expect(vm.totalIncomplete).toBe(1);

    vm.list.push({ id: "2", title: "Existing item 2", completed: false });
    expect(vm.totalIncomplete).toBe(2);
  });

  it("does not allow to delete all completed items if all are incomplete", () => {
    const vm = new TodoListViewModel();
    vm.list.push({ id: "1", title: "Existing item 1", completed: false });
    vm.list.push({ id: "2", title: "Existing item 2", completed: false });

    expect(vm.canDeleteCompleted).toBeFalsy();
  });

  it("allows to delete all completed items if some are completed", () => {
    const vm = new TodoListViewModel();
    vm.list.push({ id: "1", title: "Existing item 1", completed: true });
    vm.list.push({ id: "2", title: "Existing item 2", completed: false });

    expect(vm.canDeleteCompleted).toBeTruthy();
  });

  it("should be able to delete all completed items", () => {
    const vm = new TodoListViewModel();
    vm.list.push({ id: "1", title: "Existing item 1", completed: true });
    vm.list.push({ id: "2", title: "Existing item 2", completed: false });

    vm.deleteCompleted();

    expect(vm.list).toHaveLength(1);
    expect(vm.list).toContainEqual({ id: "2", title: "Existing item 2", completed: false });
  });

  it("should allow edit existing items", () => {
    const vm = new TodoListViewModel();
    const item = { id: "1", title: "Existing item", completed: true };
    vm.list.push(item);

    vm.editItem(item);

    expect(vm.editedItem).toStrictEqual(item);
  });

  describe("filter", () => {
    it("displays all items", () => {
      const vm = new TodoListViewModel();
      vm.list.push({ id: "1", title: "Existing item 1", completed: true });
      vm.list.push({ id: "2", title: "Existing item 2", completed: false });
      vm.list.push({ id: "3", title: "Existing item 3", completed: true });

      vm.showAll();

      expect(vm.filter).toBe("all");
      expect(vm.filteredList).toHaveLength(3);
    });

    it("displays completed items", () => {
      const vm = new TodoListViewModel();
      vm.list.push({ id: "1", title: "Existing item 1", completed: true });
      vm.list.push({ id: "2", title: "Existing item 2", completed: false });
      vm.list.push({ id: "3", title: "Existing item 3", completed: true });

      vm.showComplete();

      expect(vm.filter).toBe("complete");
      expect(vm.filteredList).toHaveLength(2);
    });

    it("displays incomplete items", () => {
      const vm = new TodoListViewModel();
      vm.list.push({ id: "1", title: "Existing item 1", completed: true });
      vm.list.push({ id: "2", title: "Existing item 2", completed: false });
      vm.list.push({ id: "3", title: "Existing item 3", completed: true });

      vm.showIncomplete();

      expect(vm.filter).toBe("incomplete");
      expect(vm.filteredList).toHaveLength(1);
    });
  });
});
