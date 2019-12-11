import { isDirty as getDirtyFlag } from "@frui.ts/dirtycheck";
import { getValidationMessage } from "@frui.ts/validation";
import { getInnerComponent, IFormFieldProps } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import * as React from "react";

export interface FieldProps {
  label: string;
}

export interface ChildProps {
  bordercolor: string;
}

export const FormField: React.FunctionComponent<IFormFieldProps<any, ChildProps> & FieldProps> = observer(props => {
  const validationMessage = getValidationMessage(props.target, props.property);
  const isDirty = getDirtyFlag(props.target, props.property);
  const bordercolor = !!validationMessage ? "red" : (isDirty ? "green" : "black");

  const childProps: ChildProps = {
    bordercolor,
  };

  const content = getInnerComponent(props, childProps);

  return (
    <div style={{ border: `1px solid ${bordercolor}`, padding: 10 }}>
      <label>{props.label}:</label><br />
      {content}
      <div style={{ color: bordercolor }}>{validationMessage}</div>
      {isDirty && <div style={{ color: "green" }}>Needs save</div>}
    </div>
  );
});

export function fieldForType<TTarget>(target: TTarget): React.FunctionComponent<IFormFieldProps<TTarget, ChildProps> & FieldProps> {
  return FormField;
}

export function fieldForTarget<TTarget>(target: TTarget): React.FunctionComponent<IFormFieldProps<TTarget, ChildProps> & FieldProps> {
  return props => <FormField {...props} target={target} />;
}
