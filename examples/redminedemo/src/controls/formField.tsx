import { isDirty as getDirtyFlag } from "@frui.ts/dirtycheck";
import { getValidationMessage } from "@frui.ts/validation";
import { getInnerComponent, IFormFieldProps } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { IChildProps, IFieldProps } from "./types";

function getControlClassName(isValid: boolean, isDirty: boolean) {
  if (!isValid) {
    return "is-invalid";
  } else if (isDirty) {
    return "is-valid";
  } else {
    return "";
  }
}

const FormField: React.FunctionComponent<IFormFieldProps<any, IChildProps> & IFieldProps> = observer(props => {
  const validationMessage = props.target && props.property && getValidationMessage(props.target, props.property);
  const isDirty = getDirtyFlag(props.target, props.property);

  const childClassName = "form-control " + getControlClassName(!validationMessage, isDirty);

  const childProps: IChildProps = {
    id: props.controlId,
    className: childClassName,
    placeholder: props.label,
  };

  const content = getInnerComponent(props, childProps);

  return (
    <div className="form-group">
      <label htmlFor={props.controlId}>{props.label}</label>
      {content}
      {!!validationMessage && <div className="invalid-feedback">{validationMessage}</div>}
    </div>
  );
});
export default FormField;

export function fieldForType<TTarget>(
  target: TTarget
): React.FunctionComponent<IFormFieldProps<TTarget, IChildProps> & IFieldProps> {
  return FormField as any;
}

export function fieldForTarget<TTarget>(
  target: TTarget
): React.FunctionComponent<IFormFieldProps<TTarget, IChildProps> & IFieldProps> {
  return (props: any) => <FormField {...props} target={target} />;
}
