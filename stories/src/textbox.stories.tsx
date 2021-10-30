import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { observable, configure } from "mobx";
import { Observer } from "mobx-react-lite";
import { Textbox } from "@frui.ts/htmlcontrols";
import React from "react";

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
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access*/}
          <dd>{object?.name}</dd>
        </dl>
      )}
    </Observer>
  );
}

const actionLogger = {
  onValueChanged: action("onValueChanged"),
};

storiesOf("HtmlTextBox", module)
  .add("Bound to property", () => (
    <div>
      <Textbox target={observableTarget} property="name" {...actionLogger} />
      {dumpTargetObject(observableTarget)}
    </div>
  ))
  .add("Bound to non-observable", () => (
    <div>
      <Textbox target={nonObservableTarget} property="name" {...actionLogger} />
      {dumpTargetObject(nonObservableTarget)}
    </div>
  ));
