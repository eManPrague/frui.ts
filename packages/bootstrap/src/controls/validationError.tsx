import { getValidationMessage } from "@frui.ts/validation";
import { IBindingProps } from "@frui.ts/views";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import { CommonInputProps } from "./commonInputProps";

export class ValidationError<TTarget> extends React.Component<CommonInputProps & IBindingProps<TTarget>> {
  render() {
    const validationError = this.getValidationError();

    return (
      <Observer>
        {() => (
          <div className="invalid-feedback" style={{ display: validationError ? "block" : "none" }}>
            {validationError}
          </div>
        )}
      </Observer>
    );
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
