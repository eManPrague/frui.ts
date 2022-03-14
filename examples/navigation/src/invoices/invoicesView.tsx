import { registerView } from "@frui.ts/views";
import { action } from "mobx";
import React from "react";
import { NavLink, Outlet, useSearchParams } from "react-router-dom";
import { createViewComponent } from "../useViewModel";
import InvoicesViewModel from "./invoicesViewModel";

export const invoicesView = createViewComponent<InvoicesViewModel>(vm => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Invoices</h2>

      <label>Direct filter:</label>
      {/* This should use a two-way bound input */}
      <input value={vm.filter} onChange={action(e => (vm.filter = e.target.value))} />

      <br />

      <label>URL filter:</label>
      <input
        value={searchParams.get("filter") ?? ""}
        onChange={event => {
          const filter = event.target.value;
          if (filter) {
            setSearchParams({ filter });
          } else {
            setSearchParams({});
          }
        }}
      />

      {vm.visibleInvoices?.map(invoice => (
        <NavLink key={invoice.id} to={`/invoices/${invoice.id}`} style={{ display: "block", margin: "1rem 0" }}>
          {({ isActive }) => (isActive ? `--${invoice.name}--` : invoice.name)}
        </NavLink>
      ))}

      <Outlet />
    </main>
  );
});

registerView(invoicesView, InvoicesViewModel);
