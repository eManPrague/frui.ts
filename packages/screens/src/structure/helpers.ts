import { IActivatable } from "./types";

export function isActivatable(vm: any): vm is Pick<IActivatable, "activate"> {
  return vm.activate && typeof vm.activate === "function";
}

export function isDeactivatable(vm: any): vm is Pick<IActivatable, "deactivate"> {
  return vm.deactivate && typeof vm.deactivate === "function";
}
