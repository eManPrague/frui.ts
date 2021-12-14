import type { LifecycleScreenNavigator } from "@frui.ts/screens";
import { getNavigator } from "@frui.ts/screens";
import { useEffect } from "react";

export default function useScreenLifecycle(vm: any, closeOnCleanup = true) {
  useEffect(() => {
    const navigator = getNavigator<LifecycleScreenNavigator>(vm);
    if (!navigator) {
      return;
    }

    if (!navigator.isActive) {
      void navigator.navigate([]);
    }

    if (navigator.deactivate) {
      return () => {
        void navigator.deactivate?.(closeOnCleanup);
      };
    }
  }, [vm]);
}
