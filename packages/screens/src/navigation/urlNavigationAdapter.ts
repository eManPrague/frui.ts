import { bound } from "@frui.ts/helpers";
import { canNavigate, IChild, IConductor, IScreen, NavigationManager } from "..";
import { ICanNavigate, IHasNavigationName } from "./types";

const hashPrefix = "#/";

export default class UrlNavigationAdapter {
  private isNavigationSuppressed = false;
  constructor(private rootViewModel: ICanNavigate) {}

  start() {
    NavigationManager.onScreenActivated = this.onScreenActivated;
    window.onpopstate = this.onUrlChanged;
    this.onUrlChanged();
  }

  @bound
  private onScreenActivated(screen: IScreen & IChild<IConductor<any>> & IHasNavigationName) {
    if (!this.isNavigationSuppressed && screen.parent && canNavigate(screen.parent)) {
      const path = screen.parent.getChildNavigationPath(screen);

      window.history.pushState(null, screen.name, hashPrefix + path.path);
    }
  }

  @bound
  private onUrlChanged() {
    const hash = window.location.hash;

    if (hash && hash.startsWith(hashPrefix)) {
      const path = hash.substr(hashPrefix.length);

      this.isNavigationSuppressed = true;
      this.rootViewModel
        .navigate(path)
        .then(() => (this.isNavigationSuppressed = false), () => (this.isNavigationSuppressed = false));
    }
  }
}
