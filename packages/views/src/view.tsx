import * as React from "react";
import useScreenLifecycle from "./useScreenLifecycle";
import { getView, tryGetView } from "./viewLocator";

interface ViewProps {
  vm: any;
  context?: string;
  useLifecycle?: boolean;
  fallbackMode?: "message" | "children";
}

const View: React.FunctionComponent<ViewProps> = ({ vm, context, useLifecycle, fallbackMode, children }) => {
  if (!vm) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  const FoundView = fallbackMode ? tryGetView(vm.constructor, context) : getView(vm.constructor, context);

  if (!FoundView) {
    return fallbackMode === "message" ? (
      <span>Could not find a view for {vm.constructor.name}</span>
    ) : (
      <React.Fragment>{children}</React.Fragment>
    );
  }

  if (!!useLifecycle) {
    useScreenLifecycle(vm);
  }
  return <FoundView vm={vm} />;
};
export default View;
