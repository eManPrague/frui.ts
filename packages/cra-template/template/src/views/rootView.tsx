import { Router } from "@frui.ts/screens";
import { registerView, View, ViewComponent } from "@frui.ts/views";
import { observer, Observer } from "mobx-react-lite";
import React from "react";
import RootViewModel from "../viewModels/rootViewModel";

const rootView: ViewComponent<RootViewModel> = observer(({ vm }) => {
  const getUrl = Router.getChildUrlFactory(vm);

  return (
    <>
      <header>
        <h1>Frui.ts bootstrap app</h1>
        <ul>
          {vm.children.map(x => (
            <li key={x.name}>
              <a className={vm.activeChild === x ? "active" : undefined} href={getUrl(x)}>
                {x.name}
              </a>
            </li>
          ))}
        </ul>
      </header>
      <div id="root-content">
        <Observer>{() => <View vm={vm.activeChild} />}</Observer>
      </div>
    </>
  );
});

registerView(rootView, RootViewModel);
