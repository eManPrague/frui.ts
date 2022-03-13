import React from "react";
import { NavLink, Outlet, useSearchParams } from "react-router-dom";

const invoices = [
  { id: 1, name: "Invoice one" },
  { id: 2, name: "Invoice two" },
  { id: 3, name: "Invoice three" },
];

export default function Invoices() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter = searchParams.get("filter");
  const filteredInvoices = filter ? invoices.filter(x => x.name.includes(filter)) : invoices;

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Invoices</h2>

      <input
        value={filter || ""}
        onChange={event => {
          const filter = event.target.value;
          if (filter) {
            setSearchParams({ filter });
          } else {
            setSearchParams({});
          }
        }}
      />

      {filteredInvoices.map(invoice => (
        <NavLink key={invoice.id} to={`/invoices/${invoice.id}`} style={{ display: "block", margin: "1rem 0" }}>
          {({ isActive }) => (isActive ? `--${invoice.name}--` : invoice.name)}
        </NavLink>
      ))}

      <Outlet />
    </main>
  );
}
