import { View } from "@frui.ts/views";
import { storiesOf } from "@storybook/react";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import RootViewModel from "./viewModels/rootViewModel";
import "./views/childView";

storiesOf("Navigation", module)
  .add("Path", () => {
    const rootViewModel = new RootViewModel();
    rootViewModel.activate();

    return <div>
      <Observer>{() =>
        <div>
          Path:
          <input value={rootViewModel.navigationPath} onChange={e => rootViewModel.setNavigationPath(e.currentTarget.value)} />
          <button onClick={rootViewModel.startNavigation}>Go</button>
        </div>}
      </Observer>

      <h2>Demo navigation</h2>
      <Observer>{() =>
        <React.Fragment>
          {rootViewModel.children.map(x => <button key={x.name} onClick={() => rootViewModel.tryActivateChild(x)}>{x.name}</button>)}
        </React.Fragment>}
      </Observer>

      <Observer>{() => !rootViewModel.activeChild ? null :
        <div>
          <h3>{rootViewModel.activeChild.name}</h3>
          <View vm={rootViewModel.activeChild} />
        </div>
      }</Observer>
    </div>;
  });
