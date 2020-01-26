import { IActivatable } from "./types";

export function isActivatable(vm: any): vm is Pick<IActivatable, "activate"> {
  return vm.activate && typeof vm.activate === "function";
}

export function isDeactivatable(vm: any): vm is Pick<IActivatable, "deactivate" | "canDeactivate"> {
  return vm.deactivate && typeof vm.deactivate === "function" && typeof vm.canDeactivate === "function";
}

export function canDeactivate(vm: any, isClosing: boolean) {
  if (isDeactivatable(vm)) {
    return vm.canDeactivate(isClosing);
  } else {
    return true;
  }
}
