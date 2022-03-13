import { NavigationContext, ScreenBase, SimpleScreenNavigator } from "@frui.ts/screens";
import { action, observable } from "mobx";
import type { Invoice } from "./data";
import { invoices } from "./data";

export default class InvoiceDetailViewModel extends ScreenBase {
  @observable invoice: Invoice | undefined;

  constructor() {
    super();
    this.navigator = new SimpleScreenNavigator(this);
  }

  @action
  onNavigate(context: NavigationContext) {
    // TODO type
    console.log({ context });
    const params = context.navigationParams as { invoiceId: string };
    const invoiceId = parseInt(params.invoiceId, 10);

    this.invoice = invoices.find(x => x.id === invoiceId);
  }
}
