import { bound } from "@frui.ts/helpers";
import * as React from "react";
import { ValidationControlBase } from "./validationControlBase";

export class ValidationError<TTarget> extends ValidationControlBase<TTarget> {
  @bound
  protected renderInner() {
    const validationError = this.getValidationError();

    return (
      <div className="invalid-feedback" style={{ display: validationError ? "block" : "none" }}>
        {validationError}
      </div>
    );
  }
}
