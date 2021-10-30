import { registerView, View } from "@frui.ts/views";
import { Observer, observer } from "mobx-react-lite";
import React from "react";
import RootViewModel from "../viewModels/rootViewModel";
import router from "../viewModels/router";

const rootView: React.FunctionComponent<{ vm: RootViewModel }> = observer(({ vm }) => {
  return (
    <div>
      <section style={{ float: "left", margin: "1rem" }}>
        <h2>Button navigation</h2>
        <Observer>
          {() => (
            <React.Fragment>
              {vm.navigator.children.map((x, i) => (
                <button key={x.navigator.navigationName} onClick={() => router.current.navigateToChild(vm, x)}>
                  {x.name}
                </button>
              ))}
            </React.Fragment>
          )}
        </Observer>
      </section>

      <section style={{ float: "left", margin: "1rem" }}>
        <h2>Link navigation</h2>
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
      </section>

      <Observer>
        {() => (
          <div style={{ clear: "both" }}>
            <h3>{vm.navigator.activeChild?.name}</h3>
            <View vm={vm.navigator.activeChild} />
          </div>
        )}
      </Observer>
    </div>
  );
});
registerView(rootView, RootViewModel);
export default rootView;
