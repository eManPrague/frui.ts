import { IPagingInfo, PagedQueryResult } from "@src/data/types";
import { action, observable } from "mobx";

export default abstract class ListViewModel<TEntity> {
  @observable public items: TEntity[];
  @observable public currentPaging: IPagingInfo;

  @action.bound protected setData(data: PagedQueryResult<TEntity>) {
      this.items = data[0];
      this.currentPaging = data[1];
  }
}
