import { BusyWatcher, IConductor, Screen } from "@frui.ts/screens";
import { action, observable } from "mobx";

export default abstract class DetailViewModel<TDetail> extends Screen {
  busyWatcher = new BusyWatcher();
  @observable item: TDetail = undefined as any;

  constructor(parent: IConductor<Screen>) {
    super();
    this.parent = parent;
  }

  @action.bound setItem(item: TDetail) {
    this.item = item;
  }

  onInitialize() {
    const process = this.loadDetail().then(this.setItem);
    return this.busyWatcher.watch(process);
  }
  protected abstract loadDetail(): Promise<TDetail>;
}
