import { IActivate, IDeactivate } from "./types";

export function isActivatable(vm: any): vm is IActivate {
  return vm.activate && typeof vm.activate === "function";
}

export function isDeactivatable(vm: any): vm is IDeactivate {
  return vm.deactivate && typeof vm.deactivate === "function";
}
