import { BusyWatcher, IConductor, ScreenBase, watchBusy } from "@frui.ts/screens";
import { action, observable } from "mobx";

export default abstract class DetailViewModel<TDetail> extends ScreenBase {
  busyWatcher = new BusyWatcher();
  @observable item: TDetail;

  @action.bound setItem(item: TDetail) {
    this.item = item;
  }

  @watchBusy
  async onInitialize() {
    const item = await this.loadDetail();
    this.setItem(item);
  }
  protected abstract loadDetail(): Promise<TDetail> | TDetail;
}
