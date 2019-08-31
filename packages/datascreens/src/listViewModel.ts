import { IPagingInfo, PagedQueryResult } from "@frui.ts/data";
import { ConductorSingleChild, Screen } from "@frui.ts/screens";
import { action, observable } from "mobx";

export default abstract class ListViewModel<TEntity, TDetail extends Screen> extends ConductorSingleChild<TDetail> {
  @observable.shallow items: TEntity[];
  @observable currentPaging: IPagingInfo;

  @action.bound protected setData([items, paging]: PagedQueryResult<TEntity>) {
    this.items = items;
    this.currentPaging = paging;
  }
}
