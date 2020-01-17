import { BusyWatcher, IConductor, ScreenBase } from "@frui.ts/screens";
import { action, observable } from "mobx";

export default abstract class DetailViewModel<TDetail> extends ScreenBase {
  busyWatcher = new BusyWatcher();
  @observable item: TDetail;

  @action.bound setItem(item: TDetail) {
    this.item = item;
  }

  onInitialize() {
    const process = this.loadDetail().then(this.setItem);
    return this.busyWatcher.watch(process);
  }
  protected abstract loadDetail(): Promise<TDetail>;
}
