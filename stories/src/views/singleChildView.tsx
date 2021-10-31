import { registerView, View } from "@frui.ts/views";
import { observer, Observer } from "mobx-react-lite";
import React from "react";
import router from "../viewModels/router";
import SingleChildViewModel from "../viewModels/singleChildViewModel";

const singleChildView: React.FunctionComponent<{ vm: SingleChildViewModel }> = observer(({ vm }) => (
  <div>
    Choose view model: &nbsp;
    <br />
    {["One", "Two", "Three"].map((x, i) => (
      <a key={x} style={{ paddingRight: "1em" }} {...router.current.hrefParams(`${router.current.getUrlForScreen(vm)}/${x}`)}>
        {x}
      </a>
    ))}
    <Observer>{() => <View vm={vm.navigator.activeChild} />}</Observer>
    <Observer>{() => <span>{vm.navigator.activeChild}</span>}</Observer>
  </div>
));
registerView(singleChildView, SingleChildViewModel);
export default singleChildView;
