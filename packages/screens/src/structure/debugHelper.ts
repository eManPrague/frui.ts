/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { isArrayLike } from "mobx";
import { ScreenBase } from "..";

interface ViewModelInfo {
  name?: string;
  navigationPath?: string;
  navigationName?: string;
  navigationParams?: any;
  activeChild?: ViewModelInfo;
  children?: ViewModelInfo[];
  instance: any;
}

export function inspectViewModelHierarchy(vm: any): ViewModelInfo {
  const screen = vm as ScreenBase;
  return {
    name: screen.name,
    navigationPath: typeof screen.getNavigationPath === "function" ? screen.getNavigationPath()?.path : undefined,
    navigationName: screen.navigationName,
    navigationParams: screen.navigationParams as unknown,
    instance: vm as unknown,
    activeChild: vm.activeChild ? inspectViewModelHierarchy(vm.activeChild) : undefined,
    children: isArrayLike(vm.children) ? (vm.children as Array<any>).map(inspectViewModelHierarchy) : undefined,
  };
}

export function dumpViewModelHierarchy(vm: any) {
  const rows: string[] = [];

  const dump = (item: ViewModelInfo) => {
    rows.push(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
