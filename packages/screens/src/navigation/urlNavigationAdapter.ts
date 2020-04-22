import { bound } from "@frui.ts/helpers";
import { parseUrl } from "query-string";
import { IScreen } from "..";
import NavigationConfiguration from "./navigationConfiguration";
import { appendQueryString } from "./navigationPath";
import { ICanNavigate } from "./types";

export default class UrlNavigationAdapter {
  private isNavigationSuppressed = false;
  private isStarted = false;
  private lastUrl = "";
  constructor(private rootViewModel: ICanNavigate) {}

  start() {
    this.isStarted = true;
    NavigationConfiguration.onScreenChanged = this.onScreenChanged;
    window.onpopstate = this.onUrlChanged;

    return this.onUrlChanged();
  }

  stop() {
    this.isStarted = false;
  }

  @bound
  private onScreenChanged(screen: IScreen & ICanNavigate) {
    if (this.isStarted && !this.isNavigationSuppressed) {
      const path = screen.getNavigationPath();

      const url = appendQueryString(NavigationConfiguration.hashPrefix + path.path, path.params);

      if (this.lastUrl !== url) {
        window.history.pushState(null, screen.name, url);
        this.lastUrl = url;
      }
    }
  }

  @bound
  private async onUrlChanged() {
    const hash = window.location.hash;

    if (this.isStarted && hash && hash.startsWith(NavigationConfiguration.hashPrefix)) {
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
