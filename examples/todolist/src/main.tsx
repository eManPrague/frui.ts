import { buildRoute } from "@frui.ts/views";
import { ReactRouter, RootRoute, RouterProvider } from "@tanstack/react-router";
import React from "react";
import { createRoot } from "react-dom/client";
import "todomvc-app-css/index.css";
import "todomvc-common/base.css";
import ListViewModel from "./list/todoListViewModel";
import "./viewsRegistry";

const rootRoute = new RootRoute();
const homeRoute = buildRoute(() => new ListViewModel(), {
  getParentRoute: () => rootRoute,
  path: "$filter",
});

const routeTree = rootRoute.addChildren([homeRoute]);

const router = new ReactRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const container = document.getElementById("root");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
