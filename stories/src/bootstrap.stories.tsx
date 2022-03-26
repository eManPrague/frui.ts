import "bootstrap/dist/css/bootstrap.css";
import { Check, Input, Select } from "@frui.ts/bootstrap";
import { attachAutomaticDirtyWatcher } from "@frui.ts/dirtycheck";
import type { EntityValidationRules } from "@frui.ts/validation";
import { attachAutomaticValidator, Configuration } from "@frui.ts/validation";
import { storiesOf } from "@storybook/react";
import { action, observable } from "mobx";
import { Observer } from "mobx-react-lite";
import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

const items = [
  { key: 1, text: "One" },
  { key: 2, text: "Two" },
  { key: 3, text: "Three" },
];

const observableTarget = observable({
  name: "John",
  age: 5,
  isActive: true,
  isInactive: false,
  isThreeState: null,
  selectedItemKey: undefined as string | undefined,
  selectedItem: undefined as unknown,
});

Configuration.valueValidators.set("required", (value, context) => {
  if (value) {
    return undefined;
  } else {
    return { code: "required", isValid: false, message: `${context.propertyName} is required` };
  }
});

const validationRules: EntityValidationRules<typeof observableTarget> = {
  name: {
    required: true,
  },
  selectedItemKey: {
    required: true,
  },
};

attachAutomaticValidator(observableTarget, validationRules, true);
attachAutomaticDirtyWatcher(observableTarget, true);

storiesOf("Bootstrap Input", module)
  .add("Simple input", () => <Input target={observableTarget} property="name" />)
  .add("Plaintext", () => <Input target={observableTarget} property="name" plaintext />)
  .add("Disabled", () => <Input target={observableTarget} property="name" disabled />)
  .add("Number", () => <Input target={observableTarget} property="age" type="number" />)
  .add("Size", () => (
    <div>
      <Input target={observableTarget} property="name" size="sm" />
      <Input target={observableTarget} property="name" />
      <Input target={observableTarget} property="name" size="lg" />
    </div>
  ))
  .add("Valid", () => <Input target={observableTarget} property="name" isValid />)
  .add("No validation", () => (
    <Input target={observableTarget} property="name" noValidation placeholder="You can use empty value here" />
  ));

storiesOf("Bootstrap Checkbox", module)
  .add("Checkbox", () => (
    <div>
      <Check target={observableTarget} property="isActive" label="Is Active" id="isActiveCheck" />
      <dl>
        <dt>Checked</dt>
        <Observer>{() => <dd>{JSON.stringify(observableTarget.isActive)}</dd>}</Observer>
      </dl>
    </div>
  ))
  .add("Checkbox three state", () => (
    <div>
      <Check target={observableTarget} property="isThreeState" label="Is three state" id="isThree" threeState />
      <Check target={observableTarget} property="isThreeState" label="Is not" id="isNotThree" />
      <Button onClick={action(() => (observableTarget.isThreeState = null))}>Reset</Button>
      <dl>
        <dt>Checked</dt>
        <Observer>{() => <dd>{JSON.stringify(observableTarget.isThreeState)}</dd>}</Observer>
      </dl>
    </div>
  ))
  .add("Switch", () => (
    <div>
      <Check target={observableTarget} type="switch" property="isActive" label="Is Active" id="isActiveCheck" />
      <dl>
        <dt>Checked</dt>
        <Observer>{() => <dd>{JSON.stringify(observableTarget.isActive)}</dd>}</Observer>
      </dl>
    </div>
  ))

  .add("Radio", () => (
    <div>
      <Check target={observableTarget} property="isActive" type="radio" label="True" />
      <Check target={observableTarget} property="isActive" value={false} type="radio" label="False" />
      <dl>
        <dt>Checked</dt>
        <Observer>{() => <dd>{JSON.stringify(observableTarget.isActive)}</dd>}</Observer>
      </dl>

      <br />

      <Check target={observableTarget} property="name" value="John" type="radio" label="John" />
      <Check target={observableTarget} property="name" value="David" type="radio" label="David" />
      <dl>
        <dt>Name</dt>
        <Observer>{() => <dd>{JSON.stringify(observableTarget.name)}</dd>}</Observer>
      </dl>
    </div>
  ));

const dumpTarget = () => (
  <Observer>
    {() => (
      <span>
        {JSON.stringify({
          selectedItemKey: observableTarget.selectedItemKey,
          selectedItem: observableTarget.selectedItem,
        })}
      </span>
    )}
  </Observer>
);

storiesOf("Bootstrap Select", module)
  .add("Key", () => (
    <div>
      <Select
        target={observableTarget}
        property="selectedItemKey"
        items={items}
        keyProperty="key"
        textProperty="text"
        mode="key"
      />
      {dumpTarget()}
    </div>
  ))
  .add("Key empty", () => (
    <div>
      <Select
        target={observableTarget}
        property="selectedItemKey"
        items={items}
        keyProperty="key"
        textProperty="text"
        mode="key"
        allowEmpty
        emptyText="Empty value"
      />
      {dumpTarget()}
    </div>
  ))
  .add("Item", () => (
    <div>
      <Select target={observableTarget} property="selectedItem" items={items} keyProperty="key" textProperty="text" mode="item" />
      {dumpTarget()}
    </div>
  ))
  .add("Item empty", () => (
    <div>
      <Select
        target={observableTarget}
        property="selectedItem"
        items={items}
        keyProperty="key"
        textProperty="text"
        mode="item"
        allowEmpty
      />
      {dumpTarget()}
    </div>
  ));

storiesOf("Bootstrap Field", module).add("Field", () => (
  <Form.Group>
    <Form.Label>Name</Form.Label>
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text>@</InputGroup.Text>
      </InputGroup.Prepend>
      <Input target={observableTarget} property="name" />
    </InputGroup>
  </Form.Group>
));
