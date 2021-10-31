import { registerView } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";
import ChildViewModel from "../viewModels/childViewModel";
import router from "../viewModels/router";

const childView: React.FunctionComponent<{ vm: ChildViewModel }> = observer(({ vm }) => (
  <p>
    {vm.text} &nbsp;
    <button title={router.current.getUrlForParent(vm)} onClick={() => router.current.navigateToParent(vm)}>
      ×
    </button>
  </p>
));
registerView(childView, ChildViewModel);
export default childView;
