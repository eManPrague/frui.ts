import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { observable } from "mobx";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import { ControlTextbox } from "./controls/controlTextbox";

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

storiesOf("ControlTextbox", module)
  .add("Bound to property", () => (
    <div>
      <ControlTextbox target={observableTarget} property="name" {...actionLogger} />
      {dumpTargetObject(observableTarget)}
    </div>
  ))
  .add("Bound to non-observable", () => (
    <div>
      <ControlTextbox target={nonObservableTarget} property="name" {...actionLogger} />
      {dumpTargetObject(nonObservableTarget)}
    </div>
  ));
