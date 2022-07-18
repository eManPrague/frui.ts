import { getDirtyWatcher } from "@frui.ts/dirtycheck";
import { getValidationMessage } from "@frui.ts/validation";
import type { IFormFieldProps } from "@frui.ts/views";
import { getInnerComponent } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";

export interface FieldProps {
  label: string;
}

export interface ChildProps {
  bordercolor: string;
}

export const FormField: React.FunctionComponent<IFormFieldProps<any, ChildProps> & FieldProps> = observer(props => {
  const validationMessage =
    props.target && props.property ? getValidationMessage(props.target, props.property as string) : undefined;
  const isDirty = getDirtyWatcher(props.target)?.checkDirtyVisible(props.property as string);
  const bordercolor = validationMessage ? "red" : isDirty ? "green" : "black";

  const childProps: ChildProps = {
    bordercolor,
  };

  const content = getInnerComponent(props, childProps);

  return (
    <div style={{ border: `1px solid ${bordercolor}`, padding: 10 }}>
      <label>{props.label}:</label>
      <br />
      {content}
      <div style={{ color: bordercolor }}>{validationMessage}</div>
      {isDirty && <div style={{ color: "green" }}>Needs save</div>}
    </div>
  );
});

export function fieldForType<TTarget>(
  _target: TTarget
): React.FunctionComponent<IFormFieldProps<TTarget, ChildProps> & FieldProps> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return FormField as any;
}

export function fieldForTarget<TTarget>(
  target: TTarget
): React.FunctionComponent<IFormFieldProps<TTarget, ChildProps> & FieldProps> {
  return (props: any) => <FormField {...props} target={target} />;
}
