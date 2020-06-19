import { bound } from "@frui.ts/helpers";
import { parseUrl } from "query-string";
import { IScreen } from "..";
import NavigationConfiguration from "./navigationConfiguration";
import { appendQueryString } from "./navigationPath";
import { ICanNavigate } from "./types";

export default class UrlNavigationAdapter {
  private isNavigationSuppressed = false;
  private lastUrl = "";

  private rootViewModel?: ICanNavigate;

  start(rootViewModel: ICanNavigate) {
    this.rootViewModel = rootViewModel;
    NavigationConfiguration.onScreenChanged = this.onScreenChanged;
    window.addEventListener("hashchange", this.onUrlChanged, false);

    return this.onUrlChanged();
  }

  stop() {
    this.rootViewModel = undefined;
  }

  @bound
  private onScreenChanged(screen: IScreen & ICanNavigate) {
    if (this.rootViewModel && !this.isNavigationSuppressed) {
      const path = screen.getNavigationPath();

      const url = appendQueryString(NavigationConfiguration.hashPrefix + path.path, path.params);

      if (this.lastUrl !== url) {
        window.history.pushState(null, screen.name, url);
        this.lastUrl = url;
      }
    }
  }

  @bound
  public async onUrlChanged() {
    const hash = window.location.hash;

    if (this.rootViewModel && hash && hash.startsWith(NavigationConfiguration.hashPrefix)) {
      const path = parseUrl(hash.substr(NavigationConfiguration.hashPrefix.length));

      this.isNavigationSuppressed = true;

      try {
        await this.rootViewModel.navigate(path.url, path.query);
      } catch (error) {
        console.error(error);
      }
      this.isNavigationSuppressed = false;
    }
  }
}
