import { makeObservable, observable, runInAction } from "mobx";
import type { IViewModel, RouteMatch } from "@frui.ts/views";

export default class InvoiceDetailViewModel implements IViewModel {
  @observable
  id = -1;

  constructor() {
    makeObservable(this);
  }

  onInitialize(routeMatch: RouteMatch) {
    runInAction(() => {
      this.id = +routeMatch.params.id;
    });
  }
}
