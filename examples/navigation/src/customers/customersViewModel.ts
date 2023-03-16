import type { IRouteViewModel, NavigationContext, NoParams } from "@frui.ts/views";
import { makeObservable, observable, runInAction } from "mobx";

type SearchScheme = { name?: string };

export default class CustomersViewModel implements IRouteViewModel<NoParams, SearchScheme> {
  @observable
  search?: string;

  constructor() {
    makeObservable(this);
  }

  onNavigate({ search }: NavigationContext<NoParams, SearchScheme>) {
    console.log("customers navigate", search);

    runInAction(() => {
      this.search = search.name;
    });
  }

  onDeactivate(context: NavigationContext<NoParams, SearchScheme>) {
    console.log("customers deactivate");
  }

  static validateSearch(search: Record<string, unknown>) {
    return {
      name: search.name as string | undefined,
    };
  }
}
