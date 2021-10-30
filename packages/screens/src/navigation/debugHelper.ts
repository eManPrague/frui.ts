import { get, isArrayLike } from "mobx";
import PathElement from "../models/pathElements";
import UrlRouterBase from "../router/urlRouterBase";
import ScreenBase, { getNavigator } from "../screens/screenBase";
import ActiveChildConductor from "./conductors/activeChildConductor";
import OneOfListActiveConductor from "./conductors/oneOfListActiveConductor";

interface ViewModelInfo {
  name?: string;
  navigationPath?: string;
  navigationName?: string;
  navigationState?: PathElement;
  activeChild?: ViewModelInfo;
  children?: ViewModelInfo[];
  instance: any;
}

export function inspectViewModelHierarchy(vm: unknown, router?: UrlRouterBase): ViewModelInfo {
  const screen = vm as ScreenBase;

  const activeChild: unknown = screen.navigator instanceof ActiveChildConductor ? screen.navigator.activeChild : undefined;
  const children = getNavigator<OneOfListActiveConductor>(screen)?.children;

  return {
    name: get(screen, "name") as string,
    navigationPath: router?.getUrlForScreen(screen),
    navigationName: screen.navigator?.navigationName,
    navigationState: screen.navigator?.getNavigationState(),
    instance: vm,
    activeChild: activeChild ? inspectViewModelHierarchy(activeChild, router) : undefined,
    children: isArrayLike(children) ? children.map(x => inspectViewModelHierarchy(x, router)) : undefined,
  };
}

export function dumpViewModelHierarchy(vm: any) {
  const rows: string[] = [];

  const dump = (item: ViewModelInfo) => {
    rows.push(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
      `/${item.navigationPath || ""} - ${item.name || item.navigationName || ""} (${item.instance?.constructor?.name || ""})`
    );
    if (item.activeChild) {
      dump(item.activeChild);
    }
    item.children?.filter(x => x.instance !== item.activeChild?.instance).forEach(dump);
  };

  const data = inspectViewModelHierarchy(vm);
  dump(data);

  return rows;
}
