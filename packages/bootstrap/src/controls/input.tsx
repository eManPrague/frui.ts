import { bound } from "@frui.ts/helpers";
import * as React from "react";
import { Form, FormControlProps } from "react-bootstrap";
import { ValidationControlBase } from "./validationControlBase";

export interface InputProps {
  onBlur?: (e: React.FormEvent<any>) => void;
  onFocus?: (e: React.FormEvent<any>) => void;
  onKeyDown?: (e: React.KeyboardEvent<any>) => void;
}

export class Input<TTarget, TOtherProps = unknown> extends ValidationControlBase<
  TTarget,
  InputProps & FormControlProps & TOtherProps
> {
  @bound
  protected renderInner() {
    const { noValidation, errorMessage, ...otherProps } = this.inheritedProps;
    const validationError = this.getValidationError();

    return (
      <>
        <Form.Control
          {...otherProps}
          value={this.value === undefined || this.value === null ? "" : this.value}
          onChange={this.handleValueChanged}
          isInvalid={!!validationError}
        />
        {validationError && <Form.Control.Feedback type="invalid">{validationError}</Form.Control.Feedback>}
      </>
    );
  }

  @bound
  protected handleValueChanged(e: React.FormEvent<any>) {
    const target = e.target as HTMLInputElement;
    if (this.props.type === "number") {
      this.setNumber(target.value);
    } else {
      this.setValue(target.value);
    }
  }

  private setNumber(value: string) {
    if (value) {
      this.setValue(+value);
    } else {
      this.setValue(value === "" ? undefined : value);
    }
  }
}
