import type { BindingTarget } from "@frui.ts/helpers";
import { bound } from "@frui.ts/helpers";
import React from "react";
import { ValidationControlBase } from "./validationControlBase";

export class ValidationError<TTarget extends BindingTarget> extends ValidationControlBase<TTarget> {
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
