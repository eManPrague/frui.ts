import { ICanNavigate } from "@frui.ts/screens";

import { NavigationConfiguration } from "@frui.ts/screens";

export function notifyRoutePathChanged(source: ICanNavigate) {
  const navigationPath = source.getNavigationPath();
  window.dispatchEvent(
    new CustomEvent("navigated", {
      detail: navigationPath,
    })
  );
}
NavigationConfiguration.onScreenChanged = notifyRoutePathChanged;
