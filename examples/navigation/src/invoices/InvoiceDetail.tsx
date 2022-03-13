import React from "react";
import { useParams } from "react-router";

export default function InvoiceDetail() {
  const params = useParams<"invoiceId">();

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Invoice #{params.invoiceId} detail</h2>
    </main>
  );
}
