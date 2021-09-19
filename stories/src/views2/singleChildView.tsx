import { registerView, View } from "@frui.ts/views";
import { observer, Observer } from "mobx-react-lite";
import React from "react";
import router from "../viewModels2/router";
import SingleChildViewModel from "../viewModels2/singleChildViewModel";

const singleChildView: React.FunctionComponent<{ vm: SingleChildViewModel }> = observer(({ vm }) =>
  !vm ? null : (
    <div>
      Choose view model: &nbsp;
      <br />
      {["One", "Two", "Three"].map((x, i) => (
        <a key={x} style={{ paddingRight: "1em" }} {...router.current.hrefParams(`${router.current.getUrlForScreen(vm)}/${x}`)}>
          {x}
        </a>
      ))}
      <Observer>{() => <View vm={vm.navigator.activeChild} />}</Observer>
    </div>
  )
);
registerView(singleChildView, SingleChildViewModel);
export default singleChildView;
