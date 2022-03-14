import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Customers from "./customers/Customers";
import "./index.css";
import InvoiceDetailViewModel from "./invoices/invoiceDetailViewModel";
import InvoicesViewModel from "./invoices/invoicesViewModel";
import { viewModel } from "./useViewModel";
import "./views";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* This route is registered as view-first, using the `createView` helper */}
          <Route path="customers" element={<Customers />} />

          {/* This route is registered as view-model-first, using automatic Frui.ts view localization. */}
          <Route path="invoices" {...viewModel(InvoicesViewModel)}>
            <Route index element={<p>Select invoice</p>} />
            <Route path=":invoiceId" {...viewModel(InvoiceDetailViewModel)} />
          </Route>
          <Route path="*" element={<p>404 not found</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
