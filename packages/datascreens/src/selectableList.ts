import { action, computed, decorate, observable } from "mobx";
import { ObservableSet } from "mobx/lib/types/observableset";
import { IList, ISelectableList } from "./types";

type Constructor<TEntity> = new (...args: any[]) => IList<TEntity>;

export type SelectableListViewModel<TViewModel, TEntity> = TViewModel & ISelectableList<TEntity>;

function Selectable<TEntity, TBase extends Constructor<TEntity>>(Base: TBase) {
  return decorate(
    class SelectableList extends Base implements ISelectableList<TEntity> {
      selectedItems: ObservableSet<TEntity> = observable(new Set<TEntity>());

      get allItemsSelected() {
        if (this.items.length && this.selectedItems.size === this.items.length) {
          return true;
        } else if (this.selectedItems.size > 0) {
          return null;
        } else {
          return false;
        }
      }

      set allItemsSelected(selectAll: boolean | null) {
        this.selectedItems.clear();
        if (selectAll) {
          this.selectedItems = observable(new Set([...this.items]));
        }
      }

      toggleItem(selectedItem: TEntity) {
        const selected = this.selectedItems.has(selectedItem);

        if (selected) {
          this.selectedItems.delete(selectedItem);
        } else {
          this.selectedItems.add(selectedItem);
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
