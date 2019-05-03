import Screen from "./screen";
import { IChild, IConductor } from "./types";

export default abstract class ConductorBase<TChild extends IChild<any>> extends Screen implements IConductor<TChild> {

  abstract activateItem(item: TChild): Promise<any>;
  abstract deactivateItem(item: TChild, close: boolean): Promise<any>;

  protected ensureChildItem(item: TChild) {
    if (item) {
      item.parent = this;
    }
  }
}
