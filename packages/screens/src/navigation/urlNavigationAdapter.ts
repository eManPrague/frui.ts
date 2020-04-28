import { bound } from "@frui.ts/helpers";
import { parseUrl, stringify } from "query-string";
import { canNavigate, IChild, IConductor, IScreen, NavigationManager } from "..";
import { getNavigationParams } from "./helpers";
import { ICanNavigate, IHasNavigationName } from "./types";

const hashPrefix = "#/";

export default class UrlNavigationAdapter {
  private isNavigationSuppressed = false;
  private isStarted = false;
  private lastUrl = "";
  constructor(private rootViewModel: ICanNavigate) {}

  start() {
    this.isStarted = true;
    NavigationManager.onActiveScreenChanged = this.onScreenActivated;
    window.addEventListener("hashchange", this.onUrlChanged, false);

    return this.onUrlChanged();
  }

  stop() {
    this.isStarted = false;
  }

  @bound
  private onScreenActivated(screen: IScreen & IChild<IConductor<any>> & IHasNavigationName) {
    if (this.isStarted && !this.isNavigationSuppressed && screen.parent && canNavigate(screen.parent)) {
      const params = getNavigationParams(screen);
      const path = screen.parent.getChildNavigationPath(screen, params);

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
  public async onUrlChanged() {
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
