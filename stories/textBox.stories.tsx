import { TextBox } from "@src/controls/textBox";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { observable } from "mobx";
import { Observer } from "mobx-react-lite";
import * as React from "react";

const observableTarget = observable({
  name: "John",
});

const nonObservableTarget = {
  name: "John",
};

function dumpTargetObject() {
  return (
    <Observer>{() =>
      <dl>
        <dt>Name</dt>
        <dd>{observableTarget.name}</dd>
      </dl>}
    </Observer>
  );
}

const actionLogger = {
  onValueChanged: action("onValueChanged"),
};

storiesOf("TextBox", module)
  .addDecorator(story => (
    <div>
      {story()}
      {dumpTargetObject()}
    </div>
  ))
  .add("Bound to property", () => <TextBox target={observableTarget} property="name" {...actionLogger} />)
  .add("Bound to non-observable", () => <TextBox target={nonObservableTarget} property="name" {...actionLogger} />);
