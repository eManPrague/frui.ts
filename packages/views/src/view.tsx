import * as React from "react";
import useScreenLifecycle from "./useScreenLifecycle";
import { getView, tryGetView } from "./viewLocator";

interface ViewProps {
  vm: any;
  context?: string;
  ignoreLifecycle?: boolean;
  fallbackMode?: "message" | "empty";
}

const View: React.FunctionComponent<ViewProps> = ({ vm, context, ignoreLifecycle, fallbackMode }) => {
  if (!vm) {
    return <React.Fragment />;
  }

  const FoundView = fallbackMode ? tryGetView(vm.constructor, context) : getView(vm.constructor, context);

  if (!FoundView) {
    return fallbackMode === "message" ? <span>Could not find a view for {vm.constructor.name}</span> : null;
  }

  if (!ignoreLifecycle) {
    useScreenLifecycle(vm);
  }
  return <FoundView vm={vm} />;
};
export default View;
