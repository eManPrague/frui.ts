import { CollectionCheckbox } from "@frui.ts/htmlcontrols";
import { action } from "@storybook/addon-actions";
import { configure } from "mobx";
import { Observer } from "mobx-react-lite";
import React from "react";

configure({ enforceActions: "observed" });

const target = {
  array: ["B"],
  collection: new Set<number>([2]),
};

const actionLogger = {
  onValueChanged: action("onValueChanged"),
};

function dumpArray(array: any[]) {
  return (
    <dl>
      <dt>Values</dt>
      <dd>{array.join(", ")}</dd>
    </dl>
  );
}

export default {
  title: "Collection checkbox",
};

export const BoundToArray = () => (
  <div>
    <CollectionCheckbox target={target} property="array" value="A" {...actionLogger} />
    <CollectionCheckbox target={target} property="array" value="B" {...actionLogger} />
    <CollectionCheckbox target={target} property="array" value="C" {...actionLogger} />
    <CollectionCheckbox target={target} property="array" value="D" {...actionLogger} />
    <Observer>{() => dumpArray(Array.from(target.array))}</Observer>
  </div>
);

BoundToArray.story = {
  name: "Bound to array",
};

export const BoundToSet = () => (
  <div>
    <CollectionCheckbox target={target} property="collection" value={1} {...actionLogger} />
    <CollectionCheckbox target={target} property="collection" value={2} {...actionLogger} />
    <CollectionCheckbox target={target} property="collection" value={3} {...actionLogger} />
    <CollectionCheckbox target={target} property="collection" value={4} {...actionLogger} />

    <Observer>{() => dumpArray(Array.from(target.collection))}</Observer>
  </div>
);

BoundToSet.story = {
  name: "Bound to Set",
};
