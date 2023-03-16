import type { IRouteViewModel, NavigationContext } from "@frui.ts/views";

export default class InvoicesViewModel implements IRouteViewModel {
  onInitialize(context: NavigationContext) {
    console.log("invoices on initialize", context);
  }

  onActivate(context: NavigationContext) {
    console.log("invoices on activate", context);
  }

  onDeactivate(context: NavigationContext) {
    console.log("invoices on deactivate", context);
  }
}
