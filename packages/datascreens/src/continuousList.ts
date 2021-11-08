import { bound } from "@frui.ts/helpers";
import FilteredList from "./filteredList";

export default class ContinuousList<TEntity, TFilter extends Record<string, any> = Record<string, any>> extends FilteredList<
  TEntity,
  TFilter
> {
  get canLoadData() {
    return !this.items || this.items.length < this.totalItems;
  }

  @bound
  async loadMore() {
    /// todo
  }
}
