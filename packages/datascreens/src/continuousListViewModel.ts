import type { PagedQueryResult } from "@frui.ts/data";
import { FilteredListViewModel } from ".";

export default abstract class ContinuousListViewModel<
  TEntity,
  TFilter extends Record<string, any> = Record<string, any>
> extends FilteredListViewModel<TEntity, TFilter> {
  get canLoadData() {
    return this.currentPaging && (!this.items || this.items.length < this.currentPaging.totalItems);
  }

  protected setDataImpl([items, paging]: PagedQueryResult<TEntity>) {
    if (!this.items?.length || paging.offset === 0) {
      this.items = items;
    } else {
      this.items = this.items.slice(0, paging.offset).concat(items.slice()); // `items.slice` is required because `items` might be a mobx observable array
    }

    this.currentPaging = {
      offset: 0,
      limit: this.items.length,
      totalItems: paging.totalItems,
    };

    // prepare for the next load
    this.pagingFilter.offset = this.items.length;
  }
}
