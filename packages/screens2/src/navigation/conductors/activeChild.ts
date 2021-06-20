import { computed, observable } from "mobx";
import ScreenLifecycleNavigator from "../screenLifecycleNavigator";

export default class ActiveChild<
  TScreen = unknown,
  TChild = unknown,
  TNavigationParams = unknown
> extends ScreenLifecycleNavigator<TScreen, TNavigationParams> {
  @observable private activeChildValue?: TChild;

  @computed get activeChild() {
    return this.activeChildValue;
  }
}
