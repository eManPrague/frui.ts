import * as React from "react";
import useScreenLifecycle from "./useScreenLifecycle";
import { getView, tryGetView } from "./viewLocator";

interface ViewProps {
  vm: any;
  context?: string;
  ignoreLifecycle?: boolean;
  enableFallback?: boolean;
}

const View: React.FunctionComponent<ViewProps> = ({ vm, context, ignoreLifecycle, enableFallback }) => {
  if (!vm) {
    return <React.Fragment />;
  }

  const FoundView = enableFallback ? tryGetView(vm.constructor, context) : getView(vm.constructor, context);

  if (!FoundView) {
    return <span>Could not find a view for {vm.constructor.name} </span>;
  }

  if (!ignoreLifecycle) {
    useScreenLifecycle(vm);
  }
  return <FoundView vm={vm} />;
};
export default View;
