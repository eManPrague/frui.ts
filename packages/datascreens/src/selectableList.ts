import { action, computed, decorate, IObservableArray, observable } from "mobx";
import { IList, ISelectableList } from "./types";

type Constructor<TEntity> = new (...args: any[]) => IList<TEntity>;

export type SelectableListViewModel<TViewModel, TEntity> = TViewModel & ISelectableList<TEntity>;

function Selectable<TEntity, TBase extends Constructor<TEntity>>(Base: TBase) {
  return decorate(
    class SelectableList extends Base implements ISelectableList<TEntity> {
      selectedItems: IObservableArray<TEntity> = observable([]);

      get allItemsSelected() {
        if (this.items.length && this.selectedItems.length === this.items.length) {
          return true;
        } else if (this.selectedItems.length > 0) {
          return null;
        } else {
          return false;
        }
      }

      set allItemsSelected(selectAll: boolean | null) {
        this.selectedItems.clear();
        if (selectAll) {
          this.selectedItems.push(...this.items);
        }
      }

      toggleItem(selectedItem: TEntity) {
        const index = this.selectedItems.findIndex(item => item === selectedItem);

        if (~index) {
          this.selectedItems.splice(index, 1);
        } else {
          this.selectedItems.push(selectedItem);
        }
      }
    },
    {
      allItemsSelected: computed,
      selectedItems: observable,
      toggleItem: action.bound,
    }
  );
}

export default Selectable;
