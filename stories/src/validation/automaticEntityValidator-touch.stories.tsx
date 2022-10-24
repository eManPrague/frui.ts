import type { EntityValidationRules, ValidationResult } from "@frui.ts/validation";
import { AutomaticEntityValidator, Configuration } from "@frui.ts/validation";
import { storiesOf } from "@storybook/react";
import { action, observable } from "mobx";
import { Observer } from "mobx-react-lite";
import React from "react";
import { Check, Input } from "../fields";
import "./style.css";
import ValidationErrors from "./validationErrors";
import ValidityIndicator from "./validityIndicator";

Configuration.valueValidators.set("required", (value, context) => {
  console.log("validating 'required'", value, context);
  if (value) {
    return undefined;
  } else {
    return { code: "required", isValid: false };
  }
});
Configuration.valueValidators.set("isJohn", (value, context) => {
  console.log("validating 'isJohn'");
  return { code: "isJohn", isValid: typeof value === "string" && value.toLowerCase() === "john" };
});

const translation = (result: ValidationResult) => {
  result.message = `Rule ${result.code} is ${result.isValid ? "valid" : "broken"}`;
  return result;
};
const observableTarget = observable({
  name: "JohnX",
  age: 5,
  isActive: true,
});

const validationRules: EntityValidationRules<typeof observableTarget> = {
  name: { required: true, isJohn: true },
  age: { required: true },
};

const validator = new AutomaticEntityValidator(observableTarget, validationRules, false, {
  ...Configuration,
  resultMiddleware: translation,
});

// this simulates repaints of the view
const increaseAge = action(() => {
  observableTarget.age++;
});

const onTouched = action(() => {
  validator.visibleProperties.add("name");
});

storiesOf("Validation", module).add("AutomaticEntityValidator - touch", () => (
  <table>
    <thead>
      <tr>
        <th>Value</th>
        <th style={{ width: 300 }}>Validation</th>
        <th>Control</th>
        <th>Misc</th>
      </tr>
    </thead>
    <tbody>
      <Observer>
        {() => (
          <tr>
            <td>
              <Input target={observableTarget} property="name" onBlur={onTouched} />
            </td>
            <td>
              <ValidityIndicator validator={validator} />
              <ValidationErrors validator={validator} property="name" />
            </td>
            <td>
              <Check target={validator} property="isEnabled" label="isEnabled" />
              <Check target={validator} property="isVisible" label="isVisible" />

              {!!validator.visibleProperties.size && (
                <>
                  Visible properties:
                  <ul>
                    {Array.from(validator.visibleProperties, x => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </>
              )}
            </td>
            <td>
              <span>Age: {observableTarget.age}</span>
              <button onClick={increaseAge}>Increment</button>
            </td>
          </tr>
        )}
      </Observer>
    </tbody>
  </table>
));
