import { View } from "@frui.ts/views";
import { Container } from "inversify";
import { reaction } from "mobx";
import React from "react";
import ReactDOM from "react-dom";
import InitializationService from "./services/initializationService";
import RootViewModel from "./viewModels/rootViewModel";

function renderViewModel(viewModel: any) {
  ReactDOM.render(<View vm={viewModel} useLifecycle />, document.getElementById("root"));
}

function renderRoot(container: Container, initializationService: InitializationService) {
  if (!initializationService.isInitialized) {
    initializationService.initialize();
    renderViewModel(initializationService);
    return;
  }

  const rootViewModel = container.get(RootViewModel);
  renderViewModel(rootViewModel);
}

export default function runApp(container: Container) {
  const initializationService = container.get<InitializationService>(InitializationService);

  reaction(
    () => initializationService.isInitialized,
    () => renderRoot(container, initializationService),
    { fireImmediately: true }
  );
}
