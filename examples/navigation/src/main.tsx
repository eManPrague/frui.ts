import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Customers from "./customers/Customers";
import "./index.css";
import InvoiceDetail from "./invoices/InvoiceDetail";
import Invoices from "./invoices/Invoices";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="invoices" element={<Invoices />}>
            <Route index element={<p>Select invoice</p>} />
            <Route path=":invoiceId" element={<InvoiceDetail />} />
          </Route>
          <Route path="customers" element={<Customers />} />
          <Route path="*" element={<p>404 not found</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
