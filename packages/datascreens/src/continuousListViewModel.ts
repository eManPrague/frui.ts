import { PagedQueryResult } from "@frui.ts/data";
import { ScreenBase } from "@frui.ts/screens";
import { FilteredListViewModel } from ".";

export default abstract class ContinuousListViewModel<
  TEntity,
  TFilter extends {} = {},
  TDetail extends ScreenBase = ScreenBase
> extends FilteredListViewModel<TEntity, TFilter, TDetail> {
  get canLoadData() {
    return this.currentPaging && this.items.length < this.currentPaging.totalItems;
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
