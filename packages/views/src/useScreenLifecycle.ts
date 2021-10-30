import { getNavigator, LifecycleScreenNavigator } from "@frui.ts/screens";
import { useEffect } from "react";

export default function useScreenLifecycle(vm: any, closeOnCleanup = true) {
  useEffect(() => {
    const navigator = getNavigator<LifecycleScreenNavigator>(vm);

    void navigator?.navigate([]);

    if (navigator?.deactivate) {
      return () => {
        void navigator?.deactivate?.(closeOnCleanup);
      };
    }
  }, [vm]);
}
