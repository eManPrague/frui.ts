import { IPagingInfo } from "@src/data/types";
import { action, observable } from "mobx";

export default abstract class ListViewModel<TEntity> {
  @observable public items: TEntity[];
  @observable public pageInfo: IPagingInfo;

  @action.bound protected setData(data: [TEntity[], IPagingInfo]) {
      this.items = data[0];
      this.pageInfo = data[1];
  }
}
