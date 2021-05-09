/* eslint-disable @typescript-eslint/no-empty-function */
import { IPagingFilter, SortingDirection } from "@frui.ts/data";
import { attachAutomaticDirtyWatcher, EntityDirtyWatcher } from "@frui.ts/dirtycheck";
import { bound } from "@frui.ts/helpers";
import { ScreenBase } from "@frui.ts/screens";
import { validate } from "@frui.ts/validation";
import { action, isObservableArray, observable } from "mobx";
import ListViewModel from "./listViewModel";

export default abstract class FilteredListViewModel<
  TEntity,
  TFilter extends Record<string, any> = Record<string, any>,
  TDetail extends ScreenBase = ScreenBase
> extends ListViewModel<TEntity, TDetail> {
  static defaultPageSize = 30;

  /** Currently edited filter */
  @observable filter: TFilter;
  filterDirtyWatcher: EntityDirtyWatcher<TFilter>;

  /** Currently edited paging filter */
  @observable pagingFilter: IPagingFilter;

  /** Filter as used when last loaded data.
   * This ensures that when, e.g., a page is changed, the original filter is used (instead of the currently edite, but not applied one). */
  @observable.shallow appliedFilter: TFilter;

  constructor() {
    super();

    this.initFilter();
  }

  abstract loadData(): Promise<any> | void;

  @action.bound
  applyFilter() {
    if (!validate(this.filter)) {
      return false;
    }

    this.appliedFilter = this.cloneFilterForApply(this.filter);
    this.pagingFilter.offset = 0;
    this.filterDirtyWatcher.reset();
    return true;
  }

  protected cloneFilterForApply(filter: TFilter): TFilter {
    const clonedFilter = { ...this.filter };

    // we need to clone array properties so that they are not shared with the original filter
    Object.entries(clonedFilter).forEach(([key, value]) => {
      if (isObservableArray(value)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        clonedFilter[key as keyof TFilter] = value.slice() as any;
      }
    });

    return clonedFilter;
  }

  @bound
  applyFilterAndLoad() {
    if (this.applyFilter()) {
      return this.loadData();
    }
  }

  @action.bound
  resetFilter() {
    this.resetFilterValues(this.filter);
  }

  @bound
  resetFilterAndLoad() {
    this.resetFilter();
    if (this.applyFilter()) {
      return this.loadData();
    }
  }

  protected resetFilterValues(filter: Partial<TFilter>) {
    for (const property in filter) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      filter[property] = undefined;
    }
  }

  protected initFilter() {
    this.pagingFilter = {
      offset: 0,
      limit: FilteredListViewModel.defaultPageSize,
      sortColumn: undefined,
      sortDirection: SortingDirection.Ascending,
    };

    if (!this.filter) {
      const filter = this.createFilter();
      this.resetFilterValues(filter);
      this.filterDirtyWatcher = attachAutomaticDirtyWatcher(filter);
      this.filter = filter;
    }
  }

  /** Returns a new instance of the filter */
  protected createFilter() {
    return {} as TFilter;
  }
}
