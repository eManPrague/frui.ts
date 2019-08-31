import { IPagingFilter, SortingDirection } from "@frui.ts/data";
import { attachAutomaticDirtyWatcher, IHasDirtyWatcher } from "@frui.ts/dirtycheck";
import { bound, Omit } from "@frui.ts/helpers";
import { Screen } from "@frui.ts/screens";
import { action, observable } from "mobx";
import ListViewModel from "./listViewModel";

export default abstract class FilteredListViewModel<TEntity, TFilter, TDetail extends Screen> extends ListViewModel<
  TEntity,
  TDetail
> {
  @observable filter: TFilter & IHasDirtyWatcher<TFilter>;
  @observable pagingFilter: IPagingFilter;

  // we need to cache applied filter so that when the user changes filter but does not Load and changes page instead, the original filter is used
  protected appliedFilter: Omit<TFilter, keyof IHasDirtyWatcher<TFilter>>;

  constructor() {
    super();

    this.initFilter();
  }

  @action.bound applyFilter() {
    const { __dirtycheck, ...actualFilter } = this.filter;
    __dirtycheck.reset();

    this.appliedFilter = actualFilter;
    this.pagingFilter.offset = 0;
  }

  @bound applyFilterAndLoad() {
    this.applyFilter();
    this.loadData();
  }

  @action.bound resetFilter() {
    this.resetFilterValues(this.filter);
    this.applyFilter();
  }

  @bound resetFilterAndLoad() {
    this.resetFilter();
    this.loadData();
  }

  abstract loadData(): void | Promise<any>;
  protected abstract resetFilterValues(filter: TFilter): void;

  private initFilter() {
    this.pagingFilter = {
      offset: 0,
      limit: 30,
      sortColumn: null,
      sortDirection: SortingDirection.Ascending,
    };

    const filter = {} as any;
    this.resetFilterValues(filter);
    attachAutomaticDirtyWatcher(filter, true);
    this.filter = filter;
  }
}
