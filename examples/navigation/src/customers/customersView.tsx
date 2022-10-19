import { registerViewComponent } from "@frui.ts/views";
import React from "react";
import CustomersViewModel from "./customersViewModel";

export const CustomersView = registerViewComponent(CustomersViewModel, vm => {
  return <p>Customers: {vm.search}</p>;
});
