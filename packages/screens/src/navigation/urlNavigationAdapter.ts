import { bound } from "@frui.ts/helpers";
import { parseUrl, stringify } from "query-string";
import { IScreen } from "..";
import NavigationConfiguration from "./navigationConfiguration";
import { ICanNavigate } from "./types";

const hashPrefix = "#/";

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

      let url = hashPrefix + path.path;
      if (path.params) {
        url += "?" + stringify(path.params);
      }

      if (this.lastUrl !== url) {
        window.history.pushState(null, screen.name, url);
        this.lastUrl = url;
      }
    }
  }

  @bound
  private async onUrlChanged() {
    const hash = window.location.hash;

    if (this.isStarted && hash && hash.startsWith(hashPrefix)) {
      const path = parseUrl(hash.substr(hashPrefix.length));

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
