import type { LocationGenerics } from "@frui.ts/views";
import { buildRoutes, RouteView } from "@frui.ts/views";
import { ReactLocation, Router } from "@tanstack/react-location";
import React from "react";
import { createRoot } from "react-dom/client";
import CustomersViewModel from "./customers/customersViewModel";
import HomeViewModel from "./home/homeViewModel";
import "./index.css";
import InvoiceDetailViewModel from "./invoices/invoiceDetailViewModel";
import InvoicesViewModel from "./invoices/invoicesViewModel";
import "./viewsRegistry";

const location = new ReactLocation<LocationGenerics>();

const routes = buildRoutes([
  {
    path: "/",
    vmFactory: () => new HomeViewModel(),
    children: [
      {
        path: "invoices",
        vmFactory: () => new InvoicesViewModel(),
        children: [
          {
            path: ":id",
            vmFactory: () => new InvoiceDetailViewModel(),
          },
          { element: "invoices list" },
        ],
      },
      {
        path: "customers",
        vmFactory: () => new CustomersViewModel(),
      },
    ],
  },
]);

const container = document.getElementById("root");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Router location={location} routes={routes} defaultElement={<RouteView />} />
  </React.StrictMode>
);
