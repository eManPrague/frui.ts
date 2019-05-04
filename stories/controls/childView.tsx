import { registerView } from "@src/views/viewLocator";
import { observer } from "mobx-react-lite";
import * as React from "react";
import ChildViewModel from "./childViewModel";

const childView: React.FunctionComponent<{ vm: ChildViewModel }> = observer(({ vm }) => !vm ? null :
  <p>
    {vm.text} &nbsp; <button onClick={vm.requestClose}>×</button>
  </p>);
registerView(childView, ChildViewModel);
export default childView;
