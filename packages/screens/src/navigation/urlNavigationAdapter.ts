import { bound } from "@frui.ts/helpers";
import { ParseOptions, parseUrl } from "query-string";
import { IScreen, ScreenBase } from "..";
import NavigationConfiguration from "./navigationConfiguration";
import { appendQueryString } from "./navigationPath";
import { ICanNavigate, INavigatedEvent } from "./types";

export default class UrlNavigationAdapter {
  private isNavigationSuppressed = false;

  // this is used when navigate() is called, to eventually call updateUrl() only for the last VM (not its parents that are activated as well along the path)
  private lastSuppressedScreen?: IScreen & ICanNavigate;

  private rootViewModel?: ICanNavigate;
  private lastActiveScreen?: IScreen;

  parseOptions?: ParseOptions;

  start(rootViewModel: ICanNavigate) {
    this.rootViewModel = rootViewModel;
    NavigationConfiguration.onScreenChanged = this.onScreenChanged;
    window.addEventListener("hashchange", this.onUrlChanged, false);

    return this.onUrlChanged();
  }

  stop() {
    this.rootViewModel = undefined;
    if (NavigationConfiguration.onScreenChanged === this.onScreenChanged) {
      NavigationConfiguration.onScreenChanged = undefined;
    }
    window.removeEventListener("hashchange", this.onUrlChanged, false);
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

      if (window.location.hash !== url) {
        const shouldReplaceUrl =
          window.location.hash &&
          url.startsWith(window.location.hash) &&
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
  public async onUrlChanged() {
    // navigation is initialized by a URL change, the new parent is unknown
    this.lastActiveScreen = undefined;

    const hash = window.location.hash;

    if (!hash) {
      await this.navigate(undefined, undefined);
    } else if (hash.startsWith(NavigationConfiguration.hashPrefix)) {
      const path = parseUrl(hash.substr(NavigationConfiguration.hashPrefix.length), this.parseOptions);
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
}
