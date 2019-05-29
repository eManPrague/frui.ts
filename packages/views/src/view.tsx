import * as React from "react";
import useScreenLifecycle from "./useScreenLifecycle";
import { getView } from "./viewLocator";

const View: React.FunctionComponent<{ vm: any, context?: string, ignoreLifecycle?: boolean }> = ({ vm, context, ignoreLifecycle }) => {
  if (!vm) {
    return <React.Fragment />;
  }
  const FoundView = getView(vm.constructor, context);

  if (!ignoreLifecycle) {
    useScreenLifecycle(vm);
  }
  return <FoundView vm={vm} />;
};
export default View;
