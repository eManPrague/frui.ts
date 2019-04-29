import * as React from "react";
import { getView } from "./viewLocator";

const View: React.FunctionComponent<{ vm: any, context?: string }> = ({ vm, context }) => {
  if (!vm) {
    return <React.Fragment />;
  }

  const FoundView = getView(vm.constructor, context);
  return <FoundView vm={vm} />;
};
export default View;
