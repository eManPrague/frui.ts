import { IPagingInfo, PagedQueryResult } from "@frui.ts/data";
import { action, observable } from "mobx";

export default abstract class ListViewModel<TEntity> {
  @observable items: TEntity[];
  @observable currentPaging: IPagingInfo;

  @action.bound protected setData(data: PagedQueryResult<TEntity>) {
      this.items = data[0];
      this.currentPaging = data[1];
  }
}
