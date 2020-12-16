import { BindingTarget, bound } from "@frui.ts/helpers";
import { IBindingProps } from "@frui.ts/views";
import React from "react";
import { Form, FormCheckProps } from "react-bootstrap";
import { CommonInputProps } from "./commonInputProps";
import { ValidationControlBase } from "./validationControlBase";

export interface CheckProps extends FormCheckProps, CommonInputProps {
  threeState?: boolean;
  value?: any;
}

export class Check<TTarget extends BindingTarget> extends ValidationControlBase<TTarget, CheckProps & IBindingProps<TTarget>> {
  static defaultProps: Partial<CheckProps> = {
    value: true,
  };

  @bound
  protected renderInner() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { threeState, value, ...otherProps } = this.inheritedProps;
    const validationError = this.getValidationError();

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const id = `${this.props.property}-${value}`;

    const threeStateProps = threeState && { ref: (el: HTMLInputElement) => el && (el.indeterminate = this.value === null) };

    return (
      <Form.Check
        id={id}
        {...otherProps}
        {...threeStateProps}
        checked={this.value === value}
        onChange={this.handleValueChanged}
        isInvalid={!!validationError}
        feedback={validationError}
      />
    );
  }

  @bound
  protected handleValueChanged(e: React.FormEvent<any>) {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      this.setValue(this.props.value);
    } else if (this.props.type !== "radio" && this.props.value === true) {
      this.setValue(false);
    }
  }
}
