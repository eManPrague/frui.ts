import { buildRootRoute, buildRoute } from "@frui.ts/views";
import { ReactRouter, Route, RouterProvider } from "@tanstack/react-router";
import React from "react";
import { createRoot } from "react-dom/client";
import CustomersViewModel from "./customers/customersViewModel";
import HomeViewModel from "./home/homeViewModel";
import "./index.css";
import InvoiceDetailViewModel from "./invoices/invoiceDetailViewModel";
import InvoicesViewModel from "./invoices/invoicesViewModel";
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

const routeTree = homeRoute.addChildren([
  indexRoute,
  invoicesRoute.addChildren([invoiceDetailRoute, defaultInvoiceRoute]),
  customersRoute,
]);

const router = new ReactRouter({ routeTree });

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
