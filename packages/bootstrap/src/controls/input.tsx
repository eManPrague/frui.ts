import { getValidationMessage } from "@frui.ts/validation";
import { BindingComponent, IBindingProps } from "@frui.ts/views";
import bind from "bind-decorator";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import { Form, FormControlProps } from "react-bootstrap";
import { CommonInputProps } from "./commonInputProps";

export interface InputProps {
  onBlur?: (e: React.FormEvent<any>) => void;
  onFocus?: (e: React.FormEvent<any>) => void;
  onKeyDown?: (e: React.KeyboardEvent<any>) => void;
}

export class Input<TTarget, OtherProps = {}> extends BindingComponent<
  InputProps & FormControlProps & CommonInputProps & OtherProps & IBindingProps<TTarget>,
  TTarget
> {
  render() {
    return <Observer render={this.renderInner} />;
  }

  @bind protected onKeyDown(e: React.KeyboardEvent<any>) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  @bind protected renderInner() {
    const { onKeyDown, noValidation, errorMessage, ...otherProps } = this.inheritedProps;
    const validationError = this.getValidationError();

    return (
      <>
        <Form.Control
          {...otherProps}
          value={this.value === undefined || this.value === null ? "" : this.value}
          onChange={this.handleValueChanged}
          isInvalid={!!validationError}
          onKeyDown={this.onKeyDown}
        />
        {validationError && <Form.Control.Feedback type="invalid">{validationError}</Form.Control.Feedback>}
      </>
    );
  }

  @bind protected handleValueChanged(e: React.FormEvent<any>) {
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

  private getValidationError() {
    const { noValidation, errorMessage } = this.props;

    if (noValidation === true) {
      return undefined;
    }

    if (errorMessage) {
      return errorMessage;
    }

    const { target, property } = this.props as IBindingProps<TTarget>;
    if (target && property) {
      return getValidationMessage(target, property);
    }

    return undefined;
  }
}
