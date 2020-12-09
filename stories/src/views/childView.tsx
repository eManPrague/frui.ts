import { registerView } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";
import ChildViewModel from "../viewModels/childViewModel";

const childView: React.FunctionComponent<{ vm: ChildViewModel }> = observer(({ vm }) =>
  !vm ? null : (
    <p>
      {vm.text} &nbsp; <button onClick={vm.requestClose}>×</button>
    </p>
  )
);
registerView(childView, ChildViewModel);
export default childView;
