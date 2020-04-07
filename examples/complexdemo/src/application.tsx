import { ScreenBase } from "@frui.ts/screens";
import { reaction } from "@frui.ts/screens/node_modules/mobx";
import { View } from "@frui.ts/views";
import { Container } from "inversify";
import React from "react";
import ReactDOM from "react-dom";
import UserContext from "./models/userContext";
import LoginViewModel from "./viewModels/loginViewModel";
import RootViewModel from "./viewModels/rootViewModel";

function renderRoot(container: Container, isUserAuthorized: boolean) {
  const viewModel: ScreenBase = isUserAuthorized ? container.get(RootViewModel) : container.get(LoginViewModel);
  ReactDOM.render(<View vm={viewModel} useLifecycle />, document.getElementById("root"));
}

export function runApp(container: Container) {
  const userContext = container.get(UserContext);

  reaction(
    () => [userContext.isAuthorized],
    ([isAuthorized]) => renderRoot(container, isAuthorized),
    { fireImmediately: true }
  );
}
