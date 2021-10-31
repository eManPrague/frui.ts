import type { ScreenNavigator } from "@frui.ts/screens";
import { preventDefault, View } from "@frui.ts/views";
import { storiesOf } from "@storybook/react";
import { action } from "mobx";
import { Observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import RootViewModel from "./viewModels/rootViewModel";
import router from "./viewModels/router";
import TestRouter from "./viewModels/testRouter";
import "./views/allChildrenActiveView";
import "./views/childView";
import "./views/oneChildActiveView";
import "./views/rootView";
import "./views/singleChildView";

function buildRouter(rootNavigator: ScreenNavigator) {
  // TODO create routes
  return new TestRouter(rootNavigator);
}

storiesOf("Navigation", module).add("Path", () => {
  const [rootViewModel, setRootViewModel] = useState<RootViewModel>();

  useEffect(() => {
    const root = new RootViewModel();
    const instance = buildRouter(root.navigator);
    void instance.initialize().then(() => {
      router.current = instance;
      setRootViewModel(root);
    });
  }, []);

  if (!rootViewModel) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Observer>
        {() => (
          <form onSubmit={preventDefault(() => router.current.navigate(router.current.currentPath))}>
            URL:
            <input
              value={router.current.currentPath}
              onChange={action(e => (router.current.currentPath = e.currentTarget.value))}
            />
            <button type="submit">Go</button>
          </form>
        )}
      </Observer>

      <hr />

      <View vm={rootViewModel} />
    </div>
  );
});
