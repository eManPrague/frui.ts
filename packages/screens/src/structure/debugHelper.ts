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
    navigationParams: screen.navigationParams,
    instance: vm,
    activeChild: vm.activeChild ? inspectViewModelHierarchy(vm.activeChild) : undefined,
    children: typeof vm.children?.map === "function" ? vm.children.map(inspectViewModelHierarchy) : undefined,
  };
}

export function dumpViewModelHierarchy(vm: any) {
  const rows: string[] = [];

  const dump = (item: ViewModelInfo) => {
    rows.push(
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
