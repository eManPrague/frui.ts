import { registerView, View } from "@frui.ts/views";
import { observer, Observer } from "mobx-react-lite";
import React from "react";
import OneChildActiveViewModel from "../viewModels/oneChildActiveViewModel";
import router from "../viewModels/router";

const oneChildActiveView: React.FunctionComponent<{ vm: OneChildActiveViewModel }> = observer(({ vm }) => (
  <div>
    Choose view model: &nbsp;
    <button onClick={vm.addChild}>+</button>
    <br />
    <Observer>
      {() => (
        <React.Fragment>
          {vm.navigator.children.map(x => (
            <button key={x.navigator.navigationName} onClick={() => router.current.navigateToChild(vm, x)}>
              {x.name}
            </button>
          ))}
        </React.Fragment>
      )}
    </Observer>
    <Observer>
      {() => (
        <React.Fragment>
          {vm.navigator.children.map((x, i) => (
            <a
              key={x.navigator.navigationName}
              style={{ paddingRight: "1em" }}
              {...router.current.hrefParams(router.current.getUrlForChild(vm, x))}>
              {x.name}
            </a>
          ))}
        </React.Fragment>
      )}
    </Observer>
    <Observer>{() => <View vm={vm.navigator.activeChild} />}</Observer>
  </div>
));
registerView(oneChildActiveView, OneChildActiveViewModel);
export default oneChildActiveView;
