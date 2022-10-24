import React from "react";
import { describe, it } from "vitest";
import { Checkbox } from "./checkbox";
import CollectionCheckbox from "./collectionCheckbox";
import Textbox from "./textbox";

describe("Checkbox", () => {
  it("is strongly typed", () => {
    const target = { name: "John", age: 10, isActive: true };

    <Checkbox target={target} property="isActive" style={{ color: "red" }} />;
  });
});

describe("CollectionCheckbox", () => {
  it("is strongly typed for array", () => {
    const target = { numbers: [1, 2, 3], text: "foo", texts: new Set<string>() };

    <CollectionCheckbox target={target} property="numbers" value={2} className="myCss" />;
  });

  it("is strongly typed for a set", () => {
    const target = { numbers: [1, 2, 3], text: "foo", texts: new Set<string>() };

    <CollectionCheckbox target={target} property="texts" value="one" style={{ color: "red" }} />;
  });
});

describe("Textbox", () => {
  it("is strongly typed", () => {
    const target = { name: "John", age: 10 };

    <Textbox target={target} property="name" className="myCss" />;
  });
});
