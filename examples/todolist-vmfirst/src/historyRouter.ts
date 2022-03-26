import type { ScreenNavigator } from "@frui.ts/screens";
import { UrlRouterBase } from "@frui.ts/screens";
import type { History, Location } from "history";
import { createBrowserHistory } from "history";
import type { MouseEvent, MouseEventHandler } from "react";

export default class HistoryRouter extends UrlRouterBase {
  private history: History;
  private listenDisposer?: () => void;

  constructor(rootNavigator?: ScreenNavigator) {
    super(rootNavigator);
    this.history = createBrowserHistory();
  }

  override async initialize(): Promise<void> {
    const location = this.history.location;
    if (location.pathname) {
      await this.navigate(this.getCurrentPathString(location));
    } else {
      await super.initialize();
    }

    this.listenDisposer = this.history.listen(({ action, location }) => {
      console.log({ action, location });
      void this.navigate(this.getCurrentPathString(location));
    });
  }

  stop() {
    this.listenDisposer?.();
  }

  protected persistUrl(url: string) {
    const currentUrl = this.getCurrentPathString(this.history.location);
    if (currentUrl !== url) {
      this.history.push(url);
    }
  }

  private getCurrentPathString(location: Location) {
    return location.search ? location.pathname + location.search : location.pathname;
  }

  hrefParams(url: string, onClick?: MouseEventHandler<any>) {
    return {
      href: url,
      onClick: async (event: MouseEvent<unknown>) => {
        event.preventDefault();
        onClick?.(event);
        await this.navigate(url);
      },
    };
  }
}
