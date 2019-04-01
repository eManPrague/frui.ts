import { getInnerComponent, IFormFieldProps } from "@src/controls/fieldHelpers";
import { getDirtyFlag } from "@src/dirtycheck";
import { getValidationMessage } from "@src/validation";
import { useObserver } from "mobx-react-lite";
import * as React from "react";
import { IChildProps, IFieldProps } from "./types";

export const FormField: React.FunctionComponent<IFormFieldProps<any, IChildProps> & IFieldProps> = (props) => useObserver(() => {
  const validationMessage = getValidationMessage(props.target, props.property);
  const isDirty = getDirtyFlag(props.target, props.property);
  const borderColor = !!validationMessage ? "red" : (isDirty ? "green" : "black");

  const childProps: IChildProps = {
    borderColor,
  };

  const content = getInnerComponent(props, childProps);

  return (
    <div style={{ border: `1px solid ${borderColor}`, padding: 10 }}>
      <label>{props.label}:</label><br />
      {content}
      <div style={{ color: borderColor }}>{validationMessage}</div>
      {isDirty && <div style={{ color: "green" }}>Needs save</div>}
    </div>
  );
});

export function fieldForType<TTarget>(target: TTarget) {
  return FormField as React.FunctionComponent<IFormFieldProps<TTarget, IChildProps> & IFieldProps>;
}

export function fieldForTarget<TTarget>(target: TTarget): React.FunctionComponent<IFormFieldProps<TTarget, IChildProps> & IFieldProps> {
  return props => <FormField {...props} target={target} />;
}
