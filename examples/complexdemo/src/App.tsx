import { View } from "@frui.ts/views";
import { Container } from "inversify";
import React from "react";
import ReactDOM from "react-dom";
import RootViewModel from "./viewModels/rootViewModel";

export function runApp(container: Container) {
  const rootViewModel = container.get(RootViewModel);
  ReactDOM.render(<View vm={rootViewModel} useLifecycle />, document.getElementById("root"));
}
