import { registerView, View } from "@frui.ts/views";
import { observer, Observer } from "mobx-react-lite";
import React from "react";
import AllChildrenActiveViewModel from "../viewModels/allChildrenActiveViewModel";

const allChildrenActiveView: React.FunctionComponent<{ vm: AllChildrenActiveViewModel }> = observer(({ vm }) =>
  !vm ? null : (
    <div>
      Child view models: &nbsp;
      <button onClick={vm.addChild}>+</button>
      <br />
      <Observer>
        {() => (
          <React.Fragment>
            {vm.navigator.children.map(x => (
              <View key={x.navigator.navigationName} vm={x} />
            ))}
          </React.Fragment>
        )}
      </Observer>
    </div>
  )
);
registerView(allChildrenActiveView, AllChildrenActiveViewModel);
export default allChildrenActiveView;
