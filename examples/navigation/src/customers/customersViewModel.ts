import { makeObservable, observable, runInAction } from "mobx";
import type { IViewModel, SearchType } from "@frui.ts/views";

export default class CustomersViewModel implements IViewModel {
  @observable
  search?: string;

  constructor() {
    makeObservable(this);
  }

  onNavigate(search: SearchType) {
    runInAction(() => {
      this.search = search.name as string;
    });
  }
}
