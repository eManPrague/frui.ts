import { createViewFirst } from "@frui.ts/views";
import React from "react";
import CustomersViewModel from "./customersViewModel";

// This is an example of simple View-first approach
// using either `createViewFirst` or `useViewModel`

export default createViewFirst(CustomersViewModel, ({ vm }) => {
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Customers</h2>
      <p>{vm.message}</p>
      <button onClick={vm.updateText}>Update</button>
    </main>
  );
});
