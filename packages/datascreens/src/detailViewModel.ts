import type { Awaitable } from "@frui.ts/helpers";
import { BusyWatcher } from "@frui.ts/helpers";
import { action, makeObservable, observable } from "mobx";

export default abstract class DetailViewModel<TEntity> {
  busyWatcher = new BusyWatcher();
  @observable item: TEntity;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setItem(item: TEntity) {
    this.item = item;
  }

  async onInitialize() {
    const item = await this.loadDetail();
    if (item) {
      this.setItem(item);
    }
  }
  protected abstract loadDetail(): Awaitable<TEntity | undefined>;
}
