import { registerViewComponent } from "@frui.ts/views";
import React from "react";
import InvoiceDetailViewModel from "./invoiceDetailViewModel";

export const InvoiceDetailView = registerViewComponent(InvoiceDetailViewModel, vm => {
  return <p>Invoice detail ID {vm.id}</p>;
});
