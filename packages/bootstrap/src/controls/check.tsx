import { bound } from "@frui.ts/helpers";
import { IBindingProps } from "@frui.ts/views";
import * as React from "react";
import { Form, FormCheckProps } from "react-bootstrap";
import { CommonInputProps } from "./commonInputProps";
import { ValidationControlBase } from "./validationControlBase";

export class Check<TTarget> extends ValidationControlBase<TTarget, FormCheckProps & CommonInputProps & IBindingProps<TTarget>> {
  @bound
  protected renderInner() {
    const { noValidation, errorMessage, ...otherProps } = this.inheritedProps;
    const validationError = this.getValidationError();

    return (
      <Form.Check
        id={this.props.property}
        {...otherProps}
        checked={!!this.value}
        onChange={this.handleValueChanged}
        isInvalid={!!validationError}
        feedback={validationError}
      />
    );
  }

  @bound
  protected handleValueChanged(e: React.FormEvent<any>) {
    const target = e.target as HTMLInputElement;
    this.setValue(target.checked);
  }
}
