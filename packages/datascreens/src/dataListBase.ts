// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { IPagingInfo, PagedQueryResult } from "@frui.ts/data";
import { observable, makeObservable } from "mobx";

export default abstract class DataListBase<T> implements IPagingInfo {
  @observable.shallow
  private itemsValue?: T[];

  constructor() {
    makeObservable(this);
  }

  get items() {
    return this.itemsValue;
  }

  @observable
  protected currentPaging?: IPagingInfo;

  get totalItems() {
    return this.currentPaging?.totalItems ?? -1;
  }

  get offset() {
    return this.currentPaging?.offset ?? 0;
  }

  get limit() {
    return this.currentPaging?.limit ?? 0;
  }

  /** Override this function to customize the setData logic */
  protected setData([items, paging]: PagedQueryResult<T>) {
    this.itemsValue = items;
    this.currentPaging = paging;
  }
}
