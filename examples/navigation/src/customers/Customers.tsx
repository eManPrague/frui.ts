import React from "react";
import { createView } from "../useViewModel";
import CustomersViewModel from "./customersViewModel";

export default createView(CustomersViewModel, ({ vm }) => {
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Customers</h2>
      <p>{vm.message}</p>
      <button onClick={vm.updateText}>Update</button>
    </main>
  );
});
