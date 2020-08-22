import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { observable, configure } from "mobx";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import FunctionTextbox from "./controls/functionTextbox";

configure({ enforceActions: "observed" });

const observableTarget = observable({
  name: "John",
});

const nonObservableTarget = {
  name: "John",
};

function dumpTargetObject(object: any) {
  return (
    <Observer>
      {() => (
        <dl>
          <dt>Name</dt>
          <dd>{object.name}</dd>
        </dl>
      )}
    </Observer>
  );
}

const actionLogger = {
  onValueChanged: action("onValueChanged"),
};

storiesOf("FunctionTextBox", module)
  .add("Bound to property", () => (
    <div>
      <FunctionTextbox target={observableTarget} property="name" {...actionLogger} />
      {dumpTargetObject(observableTarget)}
    </div>
  ))
  .add("Bound to non-observable", () => (
    <div>
      <FunctionTextbox target={nonObservableTarget} property="name" {...actionLogger} />
      {dumpTargetObject(nonObservableTarget)}
    </div>
  ));
