import { bound } from "@frui.ts/helpers";
import { IBindingProps } from "@frui.ts/views";
import * as React from "react";
import { Form, FormCheckProps } from "react-bootstrap";
import { CommonInputProps } from "./commonInputProps";
import { ValidationControlBase } from "./validationControlBase";

export interface CheckProps extends FormCheckProps, CommonInputProps {
  threeState?: boolean;
}

export class Check<TTarget> extends ValidationControlBase<TTarget, CheckProps & IBindingProps<TTarget>> {
  @bound
  protected renderInner() {
    const { noValidation, errorMessage, threeState, ...otherProps } = this.inheritedProps;
    const validationError = this.getValidationError();

    const { property } = this.props;
    const id = typeof property === "string" ? property : `${property}`;

    const threeStateProps = threeState && { ref: (el: HTMLInputElement) => el && (el.indeterminate = this.value === null) };

    return (
      <Form.Check
        id={id}
        {...otherProps}
        {...threeStateProps}
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
