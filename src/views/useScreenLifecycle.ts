import { IActivate, IDeactivate } from "@src/lifecycle/types";
import { useEffect } from "react";

export default function useScreenLifecycle(vm: any) {
  useEffect(() => {
    if (isActivatable(vm)) {
      vm.activate();
    }

    if (isDeactivatable(vm)) {
      return () => vm.deactivate(false);
    }
  }, []);
}

function isActivatable(vm: any): vm is IActivate {
  return vm.activate && vm.activate instanceof Function;
}

function isDeactivatable(vm: any): vm is IDeactivate {
  return vm.deactivate && vm.deactivate instanceof Function;
}
