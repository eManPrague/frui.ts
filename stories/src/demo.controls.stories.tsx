import { attachAutomaticValidator } from "@frui.ts//validation";
import { attachAutomaticDirtyWatcher } from "@frui.ts/dirtycheck";
import { validatorsRepository } from "@frui.ts/validation";
import { storiesOf } from "@storybook/react";
import { observable } from "mobx";
import React from "react";
import { fieldForType } from "./controls/formField";
import { Textbox } from "@frui.ts/htmlcontrols";

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
  .add("With component", () => <Field label="First name" target={observableTarget} property="name" component={Textbox} />)
  .add("With component and props",
    () => <Field label="First name" target={observableTarget} property="name" component={Textbox} componentprops={{ placeholder: "Name" }} />)
  .add("With children", () => (
    <Field label="First name" target={observableTarget} property="name">
      {(bindingProps, childProps) => <Textbox {...bindingProps} />}
    </Field>
  ));
