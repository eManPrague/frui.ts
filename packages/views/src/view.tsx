import * as React from "react";
import useScreenLifecycle from "./useScreenLifecycle";
import { getView, tryGetView } from "./viewLocator";

interface ViewProps {
  vm: any;
  context?: string;
  useLifecycle?: boolean;
  fallbackMode?: "message" | "empty";
}

const View: React.FunctionComponent<ViewProps> = ({ vm, context, useLifecycle, fallbackMode }) => {
  if (!vm) {
    return <React.Fragment />;
  }

  const FoundView = fallbackMode ? tryGetView(vm.constructor, context) : getView(vm.constructor, context);

  if (!FoundView) {
    return fallbackMode === "message" ? <span>Could not find a view for {vm.constructor.name}</span> : null;
  }

  if (!!useLifecycle) {
    useScreenLifecycle(vm);
  }
  return <FoundView vm={vm} />;
};
export default View;
