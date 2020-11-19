/* eslint-disable @typescript-eslint/no-empty-function */
import { IPagingFilter, SortingDirection } from "@frui.ts/data";
import { attachAutomaticDirtyWatcher, IHasDirtyWatcher, resetDirty } from "@frui.ts/dirtycheck";
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

  abstract loadData(): Promise<any> | void;

  @action.bound
  applyFilter() {
    if (!validate(this.filter)) {
      return false;
    }

    this.appliedFilter = this.cloneFilterForApply(this.filter);
    this.pagingFilter.offset = 0;
    resetDirty(this.filter);
    return true;
  }

  protected cloneFilterForApply(filter: TFilter): OmitValidationAndDirtyWatcher<TFilter> {
    const { __dirtycheck, __validation, ...clonedFilter } = this.filter;

    // we need to clone array properties so that they are not shared with the original filter
    Object.entries(clonedFilter).forEach(([key, value]) => {
      if (isObservableArray(value)) {
        clonedFilter[key as keyof OmitValidationAndDirtyWatcher<TFilter>] = value.slice() as any;
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

  protected resetFilterValues(filter: TFilter) {
    for (const property in filter) {
      filter[property] = undefined as any;
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
      this.filter = attachAutomaticDirtyWatcher(filter, true);
    }
  }

  /** Returns a new instance of the filter */
  protected createFilter() {
    return {} as TFilter;
  }
}
