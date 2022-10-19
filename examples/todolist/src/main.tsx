import type { LocationGenerics } from "@frui.ts/views";
import { buildRoutes, RouteView } from "@frui.ts/views";
import { ReactLocation, Router } from "@tanstack/react-location";
import React from "react";
import { createRoot } from "react-dom/client";
import "todomvc-app-css/index.css";
import "todomvc-common/base.css";
import ListViewModel from "./list/todoListViewModel";
import "./viewsRegistry";

const location = new ReactLocation<LocationGenerics>();

const routes = buildRoutes([
  {
    vmFactory: () => new ListViewModel(),
  },
]);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Router location={location} routes={routes} defaultElement={<RouteView />} />
  </React.StrictMode>
);
