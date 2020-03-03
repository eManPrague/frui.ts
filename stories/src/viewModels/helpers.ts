import { canNavigate, IChild, IConductor, IHasNavigationName } from "@frui.ts/screens";

export function notifyRoutePathChanged(source: IChild<IConductor<any>> & IHasNavigationName) {
  if (!source.parent || !canNavigate(source.parent)) {
    return;
  }

  const navigationPath = source.parent.getChildNavigationPath(source, undefined);
  window.dispatchEvent(
    new CustomEvent("navigated", {
      detail: navigationPath,
    })
  );
}
