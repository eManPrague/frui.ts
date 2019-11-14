import { bound } from "@frui.ts/helpers";
import { parseUrl, stringify } from "query-string";
import { canNavigate, IChild, IConductor, IScreen, NavigationManager } from "..";
import { getNavigationParams } from "./helpers";
import { ICanNavigate, IHasNavigationName } from "./types";

const hashPrefix = "#/";

export default class UrlNavigationAdapter {
  private isNavigationSuppressed = false;
  private lastUrl = "";
  constructor(private rootViewModel: ICanNavigate) {}

  start() {
    NavigationManager.onActiveScreenChanged = this.onScreenActivated;
    window.onpopstate = this.onUrlChanged;
    this.onUrlChanged();
  }

  @bound
  private onScreenActivated(screen: IScreen & IChild<IConductor<any>> & IHasNavigationName) {
    if (!this.isNavigationSuppressed && screen.parent && canNavigate(screen.parent)) {
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
  private onUrlChanged() {
    const hash = window.location.hash;

    if (hash && hash.startsWith(hashPrefix)) {
      const path = parseUrl(hash.substr(hashPrefix.length));

      this.isNavigationSuppressed = true;
      this.rootViewModel.navigate(path.url, path.query).then(
        () => (this.isNavigationSuppressed = false),
        () => (this.isNavigationSuppressed = false)
      );
    }
  }
}
