
// tslint:disable:jsx-boolean-value
import "!style-loader!css-loader!bootstrap/dist/css/bootstrap.css";
import { Check, Input, Select } from "@frui.ts/bootstrap";
import { attachAutomaticDirtyWatcher } from "@frui.ts/dirtycheck";
import { attachAutomaticValidator, IEntityValidationRules, validatorsRepository } from "@frui.ts/validation";
import { storiesOf } from "@storybook/react";
import { observable } from "mobx";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import { Form, InputGroup } from "react-bootstrap";

const items = [{ key: 1, text: "One" }, { key: 2, text: "Two" }, { key: 3, text: "Three" }];

const observableTarget = observable({
  name: "John",
  age: 5,
  isActive: true,
  isInactive: false,
  selectedItemKey: null as string,
  selectedItem: null as any,
});

const validationRules: IEntityValidationRules<typeof observableTarget> = {
  name: {
    required: true,
  },
  selectedItemKey: {
    required: true,
  },
};
validatorsRepository.set("required", (value, propertyName, entity, params) =>
  !params || value ? undefined : `${propertyName} is required.`
);
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
  .add("Checkbox", () => <Check target={observableTarget} property="isActive" label="Is Active" id="isActiveCheck" />)
  .add("Radio", () => (
    <div>
      <Check target={observableTarget} property="isActive" type="radio" label="Is Active" />
      <Check target={observableTarget} property="isInactive" type="radio" label="Is Inactive" />
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
      />
      {dumpTarget()}
    </div>
  ))
  .add("Item", () => (
    <div>
      <Select
        target={observableTarget}
        property="selectedItem"
        items={items}
        keyProperty="key"
        textProperty="text"
        mode="item"
      />
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
