import { NavigationContext, ScreenBase, SimpleScreenNavigator } from "@frui.ts/screens";
import type { Location } from "history";
import { action, computed, observable } from "mobx";
import type { Invoice } from "./data";
import { invoices } from "./data";

export default class InvoicesViewModel extends ScreenBase {
  @observable.shallow invoices?: Invoice[] = undefined;

  @observable filter = "";

  @computed get visibleInvoices() {
    return this.filter ? this.invoices?.filter(x => x.name.includes(this.filter)) : this.invoices;
  }

  constructor() {
    super();
    this.navigator = new SimpleScreenNavigator(this);
  }

  @action
  onInitialize() {
    this.invoices = invoices.slice();
  }

  @action
  onNavigate(context: NavigationContext) {
    // this shows how to handle query parameters
    const location = context.location as Location;
    if (location.search) {
      const search = new URLSearchParams(location.search);
      const filterValue = search.get("filter");
      this.filter = filterValue ?? "";
    } else {
      this.filter = "";
    }
  }
}
