import { registerViewComponent } from "@frui.ts/views";
import { Outlet } from "@tanstack/react-location";
import React from "react";
import InvoicesViewModel from "./invoicesViewModel";

export const InvoicesView = registerViewComponent(InvoicesViewModel, vm => {
  return (
    <div>
      <p>Invoices</p>
      <Outlet />
    </div>
  );
});
