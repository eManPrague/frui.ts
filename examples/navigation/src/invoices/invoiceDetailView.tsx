import { registerView } from "@frui.ts/views";
import React from "react";
import { createViewComponent } from "../useViewModel";
import InvoiceDetailViewModel from "./invoiceDetailViewModel";

export const invoiceDetailView = createViewComponent<InvoiceDetailViewModel>(vm => {
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>
        Invoice #{vm.invoice?.id} - {vm.invoice?.name}
      </h2>
    </main>
  );
});

registerView(invoiceDetailView, InvoiceDetailViewModel);
