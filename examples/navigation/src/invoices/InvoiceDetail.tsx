import React from "react";
import { createView } from "../useViewModel";
import InvoiceDetailViewModel from "./invoiceDetailViewModel";

export default createView(InvoiceDetailViewModel, ({ vm }) => {
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>
        Invoice #{vm.invoice?.id} - {vm.invoice?.name}
      </h2>
    </main>
  );
});
