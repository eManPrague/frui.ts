import { registerView, View } from "@frui.ts/views";
import { observer, Observer } from "mobx-react-lite";
import * as React from "react";
import OneChildActiveViewModel from "../viewModels/oneChildActiveViewModel";

// tslint:disable: jsx-no-lambda
const oneChildActiveView: React.FunctionComponent<{ vm: OneChildActiveViewModel }> = observer(({ vm }) => !vm ? null :
  <div>
    Choose view model: &nbsp;
    <Observer>{() =>
      <React.Fragment>
        {vm.children.map(x => <button key={x.name} onClick={() => vm.activateChild(x)}>{x.name}</button>)}
      </React.Fragment>}
    </Observer>
    &nbsp;
    <button onClick={vm.addChild}>+</button>

    <Observer>{() => <View vm={vm.activeChild} />}</Observer>
  </div>);
registerView(oneChildActiveView, OneChildActiveViewModel);
export default oneChildActiveView;
