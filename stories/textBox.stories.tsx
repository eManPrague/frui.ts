import { TextBox } from "@src/controls/textBox";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { observable } from "mobx";
import { Observer } from "mobx-react-lite";
import * as React from "react";

const targetObject = observable({
  name: "John",
});

function dumpTargetObject() {
  return (
    // tslint:disable-next-line: jsx-no-multiline-js
    <Observer>{() =>
      <dl>
        <dt>Name</dt>
        <dd>{targetObject.name}</dd>
      </dl>}
    </Observer>
  );
}

const actionLogger = {
  onValueChanged: action("onValueChanged"),
};

storiesOf("TextBox", module)
  .addDecorator((story) => (
    <div>
      {story()}
      {dumpTargetObject()}
    </div>
  ))
  .add("Bound to property", () => <TextBox target={targetObject} property="name" {...actionLogger} />);
