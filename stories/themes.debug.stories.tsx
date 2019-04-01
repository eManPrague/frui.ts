import { TextBox } from "@src/controls/textBox";
import { attachAutomaticDirtyWatcher } from "@src/dirtycheck";
import { attachAutomaticValidator } from "@src/validation";
import validatorsRepository from "@src/validation/validatorsRepository";
import { storiesOf } from "@storybook/react";
import { observable } from "mobx";
import * as React from "react";
import { fieldForType } from "../themes/debug/formField";

const observableTarget = observable({
  name: "John",
});

const validationRules = {
  name: {
    required: true,
  },
};
validatorsRepository.set("required", (value, propertyName, entity, params) => (!params || value) ? undefined : `${propertyName} is required.`);
attachAutomaticValidator(observableTarget, validationRules, true);
attachAutomaticDirtyWatcher(observableTarget, true);

const Field = fieldForType(observableTarget);

storiesOf("FormField", module)
  .add("With component", () => <Field label="First name" target={observableTarget} property="name" component={TextBox} />)
  .add("With component and props",
    () => <Field label="First name" target={observableTarget} property="name" component={TextBox} componentprops={{ placeholder: "Name" }} />)
  .add("With children", () => (
    <Field label="First name" target={observableTarget} property="name">
      {(bindingProps, childProps) => <TextBox {...bindingProps} />}
    </Field>
  ));
