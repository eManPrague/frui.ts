import type { IViewModel, RouteMatch } from "@frui.ts/views";

export default class InvoicesViewModel implements IViewModel {
  onInitialize(routeMatch: RouteMatch) {
    console.log("invoices on initialize", routeMatch);
  }

  onActivate(routeMatch: RouteMatch) {
    console.log("invoices on activate", routeMatch);
  }

  onDeactivate(routeMatch: RouteMatch) {
    console.log("invoices on deactivate", routeMatch);
  }
}
