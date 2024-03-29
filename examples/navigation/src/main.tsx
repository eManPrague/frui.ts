import { buildRootRoute, buildRoute } from "@frui.ts/views";
import { ReactRouter, Route, RouterProvider } from "@tanstack/react-router";
import React from "react";
import { createRoot } from "react-dom/client";
import CustomersViewModel from "./customers/customersViewModel";
import HomeViewModel from "./home/homeViewModel";
import "./index.css";
import InvoiceDetailViewModel from "./invoices/invoiceDetailViewModel";
import InvoicesViewModel from "./invoices/invoicesViewModel";
import { Settings } from "./settings/Settings";
import "./viewsRegistry";

const homeRoute = buildRootRoute(() => new HomeViewModel(), {});

const indexRoute = new Route({ getParentRoute: () => homeRoute, path: "/" });

const invoicesRoute = buildRoute(() => new InvoicesViewModel(), {
  getParentRoute: () => homeRoute,
  path: "invoices",
});

const invoiceDetailRoute = buildRoute(() => new InvoiceDetailViewModel(), {
  getParentRoute: () => invoicesRoute,
  path: "$invoiceId",
});

const defaultInvoiceRoute = new Route({
  getParentRoute: () => invoicesRoute,
  path: "/",
  component: () => <div>Invoices list</div>,
});

const customersRoute = buildRoute(() => new CustomersViewModel(), {
  getParentRoute: () => homeRoute,
  path: "customers",
  validateSearch: CustomersViewModel.validateSearch,
});

const settingsRoute = new Route({
  getParentRoute: () => homeRoute,
  path: "settings",
  component: Settings,
});

const routeTree = homeRoute.addChildren([
  indexRoute,
  invoicesRoute.addChildren([invoiceDetailRoute, defaultInvoiceRoute]),
  customersRoute,
  settingsRoute,
]);

const router = new ReactRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const container = document.getElementById("root");

const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
