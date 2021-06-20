import { storiesOf } from "@storybook/react";
import React from "react";
import RootViewModel from "./viewModels2/rootViewModel";
import "./views/childView";

storiesOf("Navigation2", module).add("Path", () => {
  const rootViewModel = new RootViewModel();

  const navigationParams = {
    foo: "bar",
  };
  console.log("can navigate", rootViewModel.navigator?.canNavigate(navigationParams));

  return (
    <div>
      <h1>{rootViewModel.name}</h1>
      {/* <Observer>
        {() => (
          <div>
            Path:
            <input value={rootViewModel.navigationPath} onChange={e => rootViewModel.setNavigationPath(e.currentTarget.value)} />
            <button onClick={rootViewModel.startNavigation}>Go</button>
          </div>
        )}
      </Observer>

      <h2>Demo navigation</h2>
      <Observer>
        {() => (
          <React.Fragment>
            {rootViewModel.children.map(x => (
              <button key={x.name} onClick={() => rootViewModel.tryActivateChild(x)}>
                {x.name}
              </button>
            ))}
          </React.Fragment>
        )}
      </Observer>

      <Observer>
        {() => (
          <div>
            <h3>{rootViewModel.activeChild?.name}</h3>
            <View vm={rootViewModel.activeChild} />
          </div>
        )}
      </Observer> */}
    </div>
  );
});
