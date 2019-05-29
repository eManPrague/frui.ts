import { View } from "@frui.ts/views";
import { storiesOf } from "@storybook/react";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import RootViewModel from "./viewModels/rootViewModel";
import "./views/childView";

// tslint:disable: jsx-no-lambda
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
          {rootViewModel.items.map(x => <button key={x.name} onClick={() => rootViewModel.activateItem(x)}>{x.name}</button>)}
        </React.Fragment>}
      </Observer>

      <Observer>{() => !rootViewModel.activeItem ? null :
        <div>
          <h3>{rootViewModel.activeItem.name}</h3>
          <View vm={rootViewModel.activeItem} />
        </div>
      }</Observer>
    </div>;
  });
