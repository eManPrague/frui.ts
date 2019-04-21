import { getInnerComponent, IFormFieldProps } from "@src/controls/fieldHelpers";
import { getDirtyFlag } from "@src/dirtycheck";
import { getValidationMessage } from "@src/validation";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { IChildProps, IFieldProps } from "./types";

const FormField: React.FunctionComponent<IFormFieldProps<any, IChildProps> & IFieldProps> = observer((props) => {
  const validationMessage = getValidationMessage(props.target, props.property);
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

function getControlClassName(isValid: boolean, isDirty: boolean) {
  if (!isValid) {
    return "is-invalid";
  }
  else if (isDirty) {
    return "is-valid";
  }
  else {
    return null;
  }
}

export function fieldForType<TTarget>(target: TTarget) {
  return FormField as React.FunctionComponent<IFormFieldProps<TTarget, IChildProps> & IFieldProps>;
}

export function fieldForTarget<TTarget>(target: TTarget): React.FunctionComponent<IFormFieldProps<TTarget, IChildProps> & IFieldProps> {
  return props => <FormField {...props} target={target} />;
}
