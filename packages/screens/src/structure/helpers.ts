import { IActivatable, IDeactivatable } from "./types";

export function isActivatable(vm: any): vm is IActivatable {
  return vm.activate && typeof vm.activate === "function";
}

export function isDeactivatable(vm: any): vm is IDeactivatable {
  return vm.deactivate && typeof vm.deactivate === "function";
}
