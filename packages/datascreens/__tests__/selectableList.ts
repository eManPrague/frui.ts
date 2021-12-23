import { ListViewModel } from "../dist";
import { Selectable, SelectableListViewModel } from "../src";

class Entity {
  name: string;
}

const firstItem: Entity = { name: "Test" };
const secondItem: Entity = { name: "Test2" };
const data: Entity[] = [firstItem, secondItem];

@Selectable
class TestSelectableList extends ListViewModel<Entity> {
  loadData() {
    this.setData([data, { totalItems: data.length, limit: 10, offset: 0 }]);
  }
}

describe("Selectable list", () => {
  let testSelectableList: SelectableListViewModel<TestSelectableList, Entity>;
  const setupService = () => {
    testSelectableList = new TestSelectableList() as SelectableListViewModel<TestSelectableList, Entity>;
    testSelectableList.loadData();
  };

  describe("Toggle items", () => {
    beforeEach(() => {
      setupService();
    });

    test("Initial state", () => {
      expect(testSelectableList.allItemsSelected).toBe(false);
    });

    test("Toggle single item", () => {
      testSelectableList.toggleItem(firstItem);

      expect(testSelectableList.selectedItems.size).toBe(1);
      expect(testSelectableList.allItemsSelected).toBe(null);
    });

    test("Toggle multiple items", () => {
      testSelectableList.toggleItem(firstItem);
      testSelectableList.toggleItem(secondItem);

      expect(testSelectableList.selectedItems.size).toBe(2);
      expect(testSelectableList.allItemsSelected).toBe(true);
    });
  });

  describe("Select all", () => {
    beforeAll(() => {
      setupService();
    });

    test("Select all", () => {
      testSelectableList.allItemsSelected = true;

      expect(testSelectableList.selectedItems.size).toBe(2);
      expect(testSelectableList.allItemsSelected).toBe(true);
    });

    test("Unselect all", () => {
      testSelectableList.allItemsSelected = false;

      expect(testSelectableList.selectedItems.size).toBe(0);
      expect(testSelectableList.allItemsSelected).toBe(false);
    });
  });
});
