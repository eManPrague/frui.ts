import { IPagingInfo, PagedQueryResult } from "@frui.ts/data";
import { ScreenBase } from "@frui.ts/screens";
import { action, observable } from "mobx";

export default abstract class ListViewModel<TEntity> extends ScreenBase {
  @observable.shallow items: TEntity[];

  /** Paging information relevant to the data in `items`. */
  @observable currentPaging: IPagingInfo;

  @action.bound
  protected setData(data: PagedQueryResult<TEntity>) {
    // since @action.bound decorated functions cannot be overriden, we need to use another function
    this.setDataImpl(data);
  }

  /** Override this function to customize the setData logic */
  protected setDataImpl([items, paging]: PagedQueryResult<TEntity>) {
    this.items = items;
    this.currentPaging = paging;
  }
}
