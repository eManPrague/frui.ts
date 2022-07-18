import type { ScreenNavigator } from "@frui.ts/screens";
import { UrlRouterBase } from "@frui.ts/screens";
import { action, makeObservable, observable } from "mobx";
import type { MouseEvent, MouseEventHandler } from "react";

export default class TestRouter extends UrlRouterBase {
  @observable
  currentPath: string;

  constructor(rootNavigator?: ScreenNavigator) {
    super(rootNavigator);
    makeObservable(this);
  }

  @action
  protected persistUrl(path: string) {
    this.currentPath = path;
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
