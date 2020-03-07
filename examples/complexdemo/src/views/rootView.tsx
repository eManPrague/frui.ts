import { registerView, ViewComponent } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";
import RootViewModel from "../viewModels/rootViewModel";

const RootView: ViewComponent<RootViewModel> = observer(({ vm }) => {
  return <p>Hello from {vm.name}!</p>;
});

registerView(RootView, RootViewModel);
