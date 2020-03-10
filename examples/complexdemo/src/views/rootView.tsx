import { registerView, ViewComponent } from "@frui.ts/views";
import React from "react";
import RootViewModel from "../viewModels/rootViewModel";

const RootView: ViewComponent<RootViewModel> = ({ vm }) => {
  return <p>Hello from {vm.name}!</p>;
};

registerView(RootView, RootViewModel);
