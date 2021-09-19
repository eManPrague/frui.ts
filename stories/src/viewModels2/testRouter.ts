import UrlRouterBase from "@frui.ts/screens2/src/router/urlRouterBase";
import { action, observable } from "mobx";
import { MouseEvent, MouseEventHandler } from "react";

export default class TestRouter extends UrlRouterBase {
  @observable
  currentPath: string;

  @action
  protected persistUrl(path: string): Promise<void> {
    this.currentPath = path;
    return Promise.resolve();
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
