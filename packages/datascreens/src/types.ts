import { ObservableSet } from "mobx";

export interface ISelectableList<TEntity> extends IList<TEntity> {
  selectedItems: ObservableSet<TEntity>;
  allItemsSelected: boolean | null;
  toggleItem(selectedItem: TEntity): void;
}

export interface IList<TEntity> {
  items: TEntity[];
}