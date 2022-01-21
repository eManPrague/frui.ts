import { bound } from "@frui.ts/helpers";
import { ParseOptions, parseUrl } from "query-string";
import ScreenBase from "../structure/screenBase";
import { IScreen } from "../structure/types";
import NavigationConfiguration from "./navigationConfiguration";
import { appendQueryString } from "./navigationPath";
import { ICanNavigate, INavigatedEvent } from "./types";

export const NAVIGATE_EVENT_NAME = "routenavigate";

export default class PathNavigationAdapter {
  private isNavigationSuppressed = false;

  // this is used when navigate() is called, to eventually call updateUrl() only for the last VM (not its parents that are activated as well along the path)
  private lastSuppressedScreen?: IScreen & ICanNavigate;

  private rootViewModel?: ICanNavigate;
  private lastActiveScreen?: IScreen;

  parseOptions?: ParseOptions;

  start(rootViewModel: ICanNavigate) {
    NavigationConfiguration.hashPrefix = "/";

    this.rootViewModel = rootViewModel;
    NavigationConfiguration.onScreenChanged = this.onScreenChanged;
    window.addEventListener(NAVIGATE_EVENT_NAME, this.onUrlChanged, false);
    window.addEventListener("popstate", this.onUrlChanged, false);

    return this.onUrlChanged(new Event("popstate"));
  }

  stop() {
    this.rootViewModel = undefined;
    if (NavigationConfiguration.onScreenChanged === this.onScreenChanged) {
      NavigationConfiguration.onScreenChanged = undefined;
    }
    window.removeEventListener(NAVIGATE_EVENT_NAME, this.onUrlChanged, false);
    window.removeEventListener("popstate", this.onUrlChanged, false);
  }

  @bound
  private onScreenChanged(screen: IScreen & ICanNavigate) {
    if (this.isNavigationSuppressed) {
      this.lastSuppressedScreen = screen;
      return;
    }

    this.updateUrl(screen);
  }

  private updateUrl(screen: IScreen & ICanNavigate) {
    if (this.rootViewModel) {
      const path = screen.getNavigationPath();
      const url = appendQueryString(NavigationConfiguration.hashPrefix + path.path, path.params);

      const currentPath = this.getCurrentPath();

      if (currentPath !== url) {
        const shouldReplaceUrl =
          currentPath &&
          url.startsWith(currentPath) &&
          (!this.lastActiveScreen || (this.lastActiveScreen as ScreenBase).childReplacesNavigationPath);

        if (shouldReplaceUrl) {
          // we are probably navigating deeper in the previously active VM,
          // so the new URL should not be another history entry,
          // but just update of the previous one instead
          window.history.replaceState(null, screen.name, url);
        } else {
          window.history.pushState(null, screen.name, url);
        }
      }
    }

    const navigateEvent = new CustomEvent<INavigatedEvent>("fruitsNavigated", {
      detail: { screenName: screen.name, screen: screen, url: window.location.toString() },
    });
    window.dispatchEvent(navigateEvent);

    this.lastActiveScreen = screen;
  }

  @bound
  public async onUrlChanged(event: Event) {
    // navigation is initialized by a URL change, the new parent is unknown
    this.lastActiveScreen = undefined;

    const currentPath: string = event.type === NAVIGATE_EVENT_NAME ? (event as CustomEvent).detail?.url : this.getCurrentPath();

    if (!currentPath) {
      await this.navigate(undefined, undefined);
    } else if (currentPath.startsWith(NavigationConfiguration.hashPrefix)) {
      const path = parseUrl(currentPath.substr(NavigationConfiguration.hashPrefix.length), this.parseOptions);
      await this.navigate(path.url, path.query);
    }
  }

  public async navigate(path: string | undefined, params: any) {
    if (this.rootViewModel) {
      try {
        this.lastSuppressedScreen = undefined;
        this.isNavigationSuppressed = true;
        await this.rootViewModel.navigate(path, params);

        if (this.lastSuppressedScreen) {
          this.updateUrl(this.lastSuppressedScreen);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isNavigationSuppressed = false;
      }
    }
  }

  private getCurrentPath() {
    return window.location.pathname + window.location.search;
  }
}
