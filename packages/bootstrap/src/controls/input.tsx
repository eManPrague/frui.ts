import { bound } from "@frui.ts/helpers";
import * as React from "react";
import { Form, FormControlProps } from "react-bootstrap";
import { ValidationControlBase } from "./validationControlBase";

export interface InputProps {
  onBlur?: (e: React.FormEvent<any>) => void;
  onFocus?: (e: React.FormEvent<any>) => void;
  onKeyDown?: (e: React.KeyboardEvent<any>) => void;
  as?: React.ElementType;
  rows?: number;
}

export function formatValueForControl(value: any) {
  if (value === undefined || value === null) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString().substring(0, 10);
  }

  return value;
}

export class Input<TTarget, TOtherProps = unknown> extends ValidationControlBase<
  TTarget,
  InputProps & FormControlProps & TOtherProps
> {
  @bound
  protected renderInner() {
    const validationError = this.getValidationError();

    return (
      <>
        <Form.Control
          {...this.inheritedProps}
          value={formatValueForControl(this.value)}
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
    switch (this.props.type) {
      case "number":
        this.setNumber(target.value);
        break;
      case "date":
        this.setDate(target.value);
        break;
      default:
        this.setValue(target.value);
        break;
    }
  }

  private setNumber(value: string) {
    if (value) {
      this.setValue(+value);
    } else {
      this.setValue(value === "" ? undefined : value);
    }
  }

  private setDate(value: string) {
    if (value) {
      this.setValue(new Date(value));
    } else {
      this.setValue(value === "" ? undefined : value);
    }
  }
}
