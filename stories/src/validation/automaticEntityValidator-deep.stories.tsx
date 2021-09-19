import { Check, Input } from "@frui.ts/bootstrap";
import { AutomaticEntityValidator, Configuration, EntityValidationRules, ValidationResult } from "@frui.ts/validation";
import { storiesOf } from "@storybook/react";
import { action, observable } from "mobx";
import { Observer } from "mobx-react-lite";
import React from "react";
import ValidationErrors from "./validationErrors";
import ValidityIndicator from "./validityIndicator";

import "!style-loader!css-loader!./style.css";

Configuration.valueValidators.set("required", (value, context) => {
  if (value) {
    return { code: "required", isValid: true };
  } else {
    return undefined;
  }
});
Configuration.valueValidators.set("isJohn", (value, context) => {
  return { code: "isJohn", isValid: typeof value === "string" && value.toLowerCase() === "john" };
});

const translation = (result: ValidationResult) => {
  result.message = `Rule ${result.code} is ${result.isValid ? "valid" : "broken"}`;
  return result;
};

const observableTarget = observable({
  name: "John",
  age: 5,
  isActive: true,
});
const validationRules: EntityValidationRules<typeof observableTarget> = {
  name: { required: true, isJohn: true },
  age: { required: true },
};
const validator = new AutomaticEntityValidator(observableTarget, validationRules, true, {
  ...Configuration,
  resultMiddleware: translation,
});

Configuration.valueValidators.set("validEntity", (value, context) => {
  // this should normally get the validator from value
  return { code: "validEntity", isValid: validator.isValid === true };
});

const parentTarget = observable({
  person: observableTarget,
});
const parentValidationRules: EntityValidationRules<typeof parentTarget> = {
  person: { validEntity: true },
};
const parentValidator = new AutomaticEntityValidator(parentTarget, parentValidationRules, true, {
  ...Configuration,
  resultMiddleware: translation,
});

// this simulates repaints of the view
const increaseAge = action(() => {
  observableTarget.age++;
});

storiesOf("Validation", module).add("AutomaticEntityValidator - Deep", () => (
  <table>
    <thead>
      <tr>
        <th>Value</th>
        <th style={{ width: 300 }}>Validation</th>
        <th>Control</th>
        <th>Misc</th>
      </tr>
    </thead>
    <Observer>
      {() => (
        <tbody>
          <tr>
            <td></td>
            <td>
              <ValidityIndicator validator={parentValidator} />
              <ValidationErrors validator={parentValidator} property="person" />
            </td>
            <td>
              <Check id="parentEnabled" target={parentValidator} property="isEnabled" label="isEnabled" />
              <Check id="parentVisible" target={parentValidator} property="isVisible" label="isVisible" />
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <Input target={observableTarget} property="name" />
            </td>
            <td>
              <ValidityIndicator validator={validator} />
              <ValidationErrors validator={validator} property="name" />
            </td>
            <td>
              <Check target={validator} property="isEnabled" label="isEnabled" />
              <Check target={validator} property="isVisible" label="isVisible" />
            </td>
            <td>
              <span>Age: {observableTarget.age}</span>
              <button onClick={increaseAge}>Increment</button>
            </td>
          </tr>
        </tbody>
      )}
    </Observer>
  </table>
));
