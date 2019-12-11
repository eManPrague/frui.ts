import { IPagingFilter, SortingDirection } from "@frui.ts/data";
import { attachAutomaticDirtyWatcher, IHasDirtyWatcher } from "@frui.ts/dirtycheck";
import { bound } from "@frui.ts/helpers";
import { ScreenBase } from "@frui.ts/screens";
import { IHasValidation, validate } from "@frui.ts/validation";
import { action, observable } from "mobx";
import ListViewModel from "./listViewModel";

type OmitValidationAndDirtyWatcher<T> = Omit<T, keyof IHasDirtyWatcher<T> | keyof IHasValidation<T>>;

export default abstract class FilteredListViewModel<TEntity, TFilter, TDetail extends ScreenBase> extends ListViewModel<
  TEntity,
  TDetail
> {
  static defaultPageSize = 30;

  @observable filter: TFilter & IHasDirtyWatcher<TFilter> & Partial<IHasValidation<TFilter>>;
  @observable pagingFilter: IPagingFilter;

  // we need to cache applied filter so that when the user changes filter but does not Load and changes page instead, the original filter is used
  protected appliedFilter: OmitValidationAndDirtyWatcher<TFilter>;

  constructor() {
    super();

    this.initFilter();
  }

  @action.bound applyFilter() {
    if (!validate(this.filter)) {
      return false;
    }

    const { __dirtycheck, __validation, ...actualFilter } = this.filter;
    __dirtycheck.reset();

    this.appliedFilter = actualFilter;
    this.pagingFilter.offset = 0;
    return true;
  }

  @bound applyFilterAndLoad() {
    if (this.applyFilter()) {
      return this.loadData();
    }
  }

  @action.bound resetFilter() {
    this.resetFilterValues(this.filter);
    this.applyFilter();
  }

  @bound resetFilterAndLoad() {
    this.resetFilter();
    return this.loadData();
  }

  abstract loadData(): void | Promise<any>;
  protected abstract resetFilterValues(filter: TFilter): void;

  private initFilter() {
    this.pagingFilter = {
      offset: 0,
      limit: FilteredListViewModel.defaultPageSize,
      sortColumn: null,
      sortDirection: SortingDirection.Ascending,
    };

    const filter = {} as any;
    this.resetFilterValues(filter);
    attachAutomaticDirtyWatcher(filter, true);
    this.filter = filter;
  }
}
