import { NavigationContext, ScreenBase, SimpleScreenNavigator } from "@frui.ts/screens";
import { action, observable } from "mobx";
import type { Invoice } from "./data";
import { invoices } from "./data";

interface NavigationParams {
  invoiceId: string;
}

export default class InvoiceDetailViewModel extends ScreenBase<SimpleScreenNavigator<NavigationParams>> {
  @observable invoice: Invoice | undefined;

  constructor() {
    super();
    this.navigator = new SimpleScreenNavigator<NavigationParams>(this);
  }

  @action
  onNavigate(context: NavigationContext<NavigationParams>) {
    // this shows hot to handle route parameters
    const invoiceIdString = context.navigationParams?.invoiceId;
    if (invoiceIdString) {
      const invoiceId = parseInt(invoiceIdString, 10);

      // load data
      this.invoice = invoices.find(x => x.id === invoiceId);
    }
  }
}
