import UrlRouterBase from "@frui.ts/screens2/src/router/urlRouterBase";
import { storiesOf } from "@storybook/react";
import { action, observable } from "mobx";
import { Observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import RootViewModel from "./viewModels2/rootViewModel";
import "./views/childView";

class TestRouter extends UrlRouterBase {
  @observable
  currentPath: string;

  @action
  protected persistPath(path: string): Promise<void> {
    this.currentPath = path;
    return Promise.resolve();
  }
}

storiesOf("Navigation2", module).add("Path", () => {
  const rootViewModel = useRef(new RootViewModel()).current;
  const router = useRef(new TestRouter(rootViewModel.navigator)).current;

  const [path, setPath] = useState("");

  useEffect(() => {
    void router.initialize().then(() => setPath(router.currentPath));
  }, []);

  return (
    <div>
      <h1>{rootViewModel.name}</h1>
      <Observer>
        {() => (
          <div>
            Path:
            <input value={path} onChange={e => setPath(e.currentTarget.value)} />
            <button onClick={() => router.setPath(path)}>Go</button>
          </div>
        )}
      </Observer>

      {/*     <h2>Demo navigation</h2>
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
