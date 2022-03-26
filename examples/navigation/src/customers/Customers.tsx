import { createView } from "@frui.ts/views";
import React from "react";
import CustomersViewModel from "./customersViewModel";

// This is an example of simple View-first approach
// using either `createView` or `useViewModel`

export default createView(CustomersViewModel, ({ vm }) => {
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Customers</h2>
      <p>{vm.message}</p>
      <button onClick={vm.updateText}>Update</button>
    </main>
  );
});
