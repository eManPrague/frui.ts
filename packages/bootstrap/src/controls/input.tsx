import { getValidationMessage } from "@frui.ts/validation";
import { BindingComponent, IBindingProps } from "@frui.ts/views";
import bind from "bind-decorator";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import { Form, FormControlProps } from "react-bootstrap";
import { CommonInputProps } from "./commonInputProps";

export class Input<TTarget> extends BindingComponent<
  FormControlProps & CommonInputProps & IBindingProps<TTarget>,
  TTarget
> {
  render() {
    return <Observer render={this.renderInner} />;
  }

  @bind protected renderInner() {
    const { noValidation, errorMessage, ...otherProps } = this.inheritedProps;
    const validationError =
      noValidation !== true &&
      this.props.target &&
      this.props.property &&
      (errorMessage || getValidationMessage(this.props.target, this.props.property));

    return (
      <>
        <Form.Control
          {...otherProps}
          // tslint:disable-next-line:
          value={this.value == undefined ? "" : this.value}
          onChange={this.handleValueChanged}
          isInvalid={!!validationError}
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
}
