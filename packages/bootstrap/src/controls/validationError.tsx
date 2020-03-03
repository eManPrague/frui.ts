import { getValidationMessage } from "@frui.ts/validation";
import { IBindingProps } from "@frui.ts/views";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import { CommonInputProps } from "./commonInputProps";

export class ValidationError<TTarget> extends React.Component<CommonInputProps & IBindingProps<TTarget>> {
  render() {
    const { noValidation, errorMessage } = this.props;
    const validationError =
      noValidation !== true && (errorMessage || getValidationMessage(this.props.target!, this.props.property!));

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
}
