import { Check, Input } from "@frui.ts/bootstrap";
import { ManualEntityValidator } from "@frui.ts/validation";
import { storiesOf } from "@storybook/react";
import { observable } from "mobx";
import React from "react";
import ValidationErrors from "./validationErrors";
import ValidityIndicator from "./validityIndicator";

const observableTarget = observable({
  name: "John",
  age: 5,
  isActive: true,
});

const validator = new ManualEntityValidator<typeof observableTarget>(true);
const addManualError = () => {
  validator.setResult("name", { code: "manual", isValid: false });
};

storiesOf("Validation", module).add("ManualEntityValidator", () => (
  <table>
    <thead>
      <tr>
        <th>Value</th>
        <th style={{ width: 300 }}>Validation</th>
        <th>Control</th>
        <th>Other</th>
      </tr>
    </thead>
    <tbody>
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
          <button onClick={addManualError}>Add error</button>
          <button onClick={() => validator.clearResults()}>Clear errors</button>
        </td>
      </tr>
    </tbody>
  </table>
));
