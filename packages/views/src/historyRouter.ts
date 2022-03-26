import type { ScreenNavigator } from "@frui.ts/screens";
import { UrlRouterBase } from "@frui.ts/screens";
import type { History, Location } from "history";
import { createBrowserHistory } from "history";
import type { MouseEvent, MouseEventHandler } from "react";

export default class HistoryRouter extends UrlRouterBase {
  private listenDisposer?: () => void;

  constructor(rootNavigator?: ScreenNavigator, private history: History = createBrowserHistory()) {
    super(rootNavigator);
  }

  override async initialize(): Promise<void> {
    const location = this.history.location;
    if (location.pathname) {
      await this.navigate(getLocationPath(location));
    } else {
      await super.initialize();
    }

    this.listenDisposer = this.history.listen(({ location }) => {
      void this.navigate(getLocationPath(location));
    });
  }

  stop() {
    this.listenDisposer?.();
  }

  protected persistUrl(url: string) {
    const currentUrl = getLocationPath(this.history.location);
    if (currentUrl !== url) {
      this.history.push(url);
    }
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

function getLocationPath(location: Location) {
  return location.search ? location.pathname + location.search : location.pathname;
}
