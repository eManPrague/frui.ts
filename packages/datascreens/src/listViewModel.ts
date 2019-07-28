import { IPagingInfo, PagedQueryResult } from "@frui.ts/data";
import { Screen } from "@frui.ts/screens";
import { action, observable } from "mobx";

export default abstract class ListViewModel<TEntity> extends Screen {
  @observable items: TEntity[];
  @observable currentPaging: IPagingInfo;

  @action.bound protected setData(data: PagedQueryResult<TEntity>) {
      this.items = data[0];
      this.currentPaging = data[1];
  }
}
