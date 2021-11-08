import type { PagedQueryResult } from "@frui.ts/data";
import { IPagingInfo } from "@frui.ts/data";
import { observable } from "mobx";

export default abstract class DataListBase<T> implements IPagingInfo {
  @observable.shallow itemsValue?: T[];
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
