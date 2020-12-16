import { isActivatable, isDeactivatable } from "@frui.ts/screens";
import { useEffect } from "react";

export default function useScreenLifecycle(vm: any, closeOnCleanup = true) {
  useEffect(() => {
    if (isActivatable(vm)) {
      void vm.activate();
    }

    if (isDeactivatable(vm)) {
      return () => {
        void vm.deactivate(closeOnCleanup);
      };
    }
  }, [vm]);
}
