import { ScreenNavigator } from "@frui.ts/screens2/src/navigation/types";
import { preventDefault, View } from "@frui.ts/views";
import { storiesOf } from "@storybook/react";
import { action } from "mobx";
import { Observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import TestRouter from "./viewModels2/testRouter";
import RootViewModel from "./viewModels2/rootViewModel";
import router from "./viewModels2/router";
import "./views2/allChildrenActiveView";
import "./views2/childView";
import "./views2/oneChildActiveView";
import "./views2/rootView";
import "./views2/singleChildView";

function buildRouter(rootNavigator: ScreenNavigator) {
  // TODO create routes
  return new TestRouter(rootNavigator);
}

storiesOf("Navigation2", module).add("Path", () => {
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
              value={router.current.currentPath ?? "uninitialized"}
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
