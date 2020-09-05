import { bound } from "@frui.ts/helpers";
import { parseUrl, ParseOptions } from "query-string";
import { IScreen, ScreenBase } from "..";
import NavigationConfiguration from "./navigationConfiguration";
import { appendQueryString } from "./navigationPath";
import { ICanNavigate } from "./types";

export default class UrlNavigationAdapter {
  private isNavigationSuppressed = false;
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
        if ((this.lastActiveScreen as ScreenBase)?.childReplacesNavigationPath && url.startsWith(window.location.hash)) {
          // we are probably navigating deeper in the previously active VM,
          // so the new URL should not be another history entry,
          // but just update of the previous one instead
          window.history.replaceState(null, screen.name, url);
        } else {
          window.history.pushState(null, screen.name, url);
        }
      }
    }

    this.lastActiveScreen = screen;
  }

  @bound
  public async onUrlChanged() {
    const hash = window.location.hash;

    if (hash && hash.startsWith(NavigationConfiguration.hashPrefix)) {
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
