import { IChild, IConductor } from "@src/lifecycle/types";
import { canNavigate } from "@src/navigation/helpers";
import { IHasNavigationName } from "@src/navigation/types";

export function notifyRoutePathChanged(source: IChild<IConductor<any>> & IHasNavigationName) {
  if (!source.parent || !canNavigate(source.parent)) {
    return;
  }

  const navigationPath = source.parent.getNavigationPath(source);
  window.dispatchEvent(new CustomEvent("navigated", {
    detail: navigationPath,
  }));

  // tslint:disable-next-line: no-console
  // console.log("navigation", navigationPath.path, navigationPath.isClosed);
}
