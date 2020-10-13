/* eslint-disable @typescript-eslint/no-empty-function */
import { IPagingFilter, SortingDirection } from "@frui.ts/data";
import { attachAutomaticDirtyWatcher, IHasDirtyWatcher } from "@frui.ts/dirtycheck";
import { bound } from "@frui.ts/helpers";
import { ScreenBase } from "@frui.ts/screens";
import { IHasValidation, validate } from "@frui.ts/validation";
import { action, observable, isObservableArray } from "mobx";
import ListViewModel from "./listViewModel";

type OmitValidationAndDirtyWatcher<T> = Omit<T, keyof IHasDirtyWatcher<T> | keyof IHasValidation<T>>;

export default abstract class FilteredListViewModel<
  TEntity,
  TFilter extends {} = {},
  TDetail extends ScreenBase = ScreenBase
> extends ListViewModel<TEntity, TDetail> {
  static defaultPageSize = 30;

  /** Currently edited filter */
  @observable filter: TFilter & IHasDirtyWatcher<TFilter> & Partial<IHasValidation<TFilter>>;
  /** Currently edited paging filter */
  @observable pagingFilter: IPagingFilter;

  /** Filter as used when last loaded data.
   * This ensures that when, e.g., a page is changed, the original filter is used (instead of the currently edite, but not applied one). */
  @observable.shallow appliedFilter: OmitValidationAndDirtyWatcher<TFilter>;

  constructor() {
    super();

    this.initFilter();
  }

  @action.bound
  applyFilter() {
    if (!validate(this.filter)) {
      return false;
    }

    const { __dirtycheck, __validation, ...clonedFilter } = this.filter;
    __dirtycheck.reset();

    this.unbindClonedFilter(clonedFilter as any);
    this.appliedFilter = clonedFilter;
    this.pagingFilter.offset = 0;
    return true;
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
    this.applyFilter();
    return this.loadData();
  }

  abstract loadData(): Promise<any> | void;
  protected abstract resetFilterValues(filter: TFilter): void;

  /** Fixes filter that has been shallowly cloned and set to appliedFilter. */
  protected unbindClonedFilter(filter: TFilter): void {
    // by default, clone first level of arrays
    Object.entries(filter).forEach(([key, value]) => {
      if (isObservableArray(value)) {
        filter[key as keyof TFilter] = value.slice() as any;
      }
    });
  }

  /** Returns a new instance of the filter */
  protected createFilter() {
    return {} as TFilter;
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
      this.filter = attachAutomaticDirtyWatcher(filter, true);
    }
  }
}
