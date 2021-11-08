import type { PagedQueryResult } from "@frui.ts/data";
import { IPagingFilter } from "@frui.ts/data";
import { attachDirtyWatcher, AutomaticDirtyWatcher } from "@frui.ts/dirtycheck";
import { bound } from "@frui.ts/helpers";
import { validate } from "@frui.ts/validation";
import { action, isArrayLike, observable, runInAction } from "mobx";
import DataListBase from "./dataListBase";

export default class FilteredList<
  TEntity,
  TFilter extends Record<string, any> = Record<string, any>
> extends DataListBase<TEntity> {
  static defaultPageSize = 30;

  @observable
  protected filterValue: TFilter;

  /** Currently edited filter */
  get filter() {
    return this.filterValue;
  }

  @observable.shallow
  protected appliedFilterValue: TFilter;

  /** Filter as used when last loaded data.
   * This ensures that when, e.g., a page is changed, the original filter is used (instead of the currently edite, but not applied one). */
  get appliedFilter(): Readonly<TFilter> {
    return this.appliedFilterValue;
  }

  @observable
  protected pagingFilterValue: IPagingFilter;

  get pagingFilter(): Readonly<IPagingFilter> {
    return this.pagingFilterValue;
  }

  constructor(
    public onLoadData: (filter: TFilter, paging: IPagingFilter) => Promise<PagedQueryResult<TEntity>>,
    private initFilter: () => TFilter = () => ({} as TFilter),
    private defaultPagingFilter: () => IPagingFilter = () => ({
      limit: FilteredList.defaultPageSize,
      offset: 0,
    })
  ) {
    super();
  }

  @action.bound
  resetFilter() {
    this.filterValue = this.initFilter();
    attachDirtyWatcher(this.filterValue, new AutomaticDirtyWatcher(this.filterValue));
  }

  @bound
  resetFilterAndLoad() {
    this.resetFilter();
    return this.applyFilterAndLoad();
  }

  @bound
  async applyFilterAndLoad() {
    if (!validate(this.filter)) {
      return false;
    }

    const appliedFilter = this.cloneFilter(this.filter);
    const paging = this.defaultPagingFilter();
    const data = await this.onLoadData(appliedFilter, paging);

    runInAction(() => {
      this.appliedFilterValue = appliedFilter;
      this.setData(data);
    });

    return true;
  }

  @bound
  async applyPaging() {
    const data = await this.onLoadData(this.appliedFilter, this.pagingFilter);
    this.setData(data);
  }

  protected cloneFilter(filter: TFilter): TFilter {
    const clonedFilter = { ...this.filter };

    // we need to clone array properties so that they are not shared with the original filter
    Object.entries(clonedFilter).forEach(([key, value]) => {
      if (isArrayLike(value)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        clonedFilter[key as keyof TFilter] = value.slice() as any;
      }
    });

    return clonedFilter;
  }
}
