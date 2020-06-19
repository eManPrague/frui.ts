import { getValidationMessage } from "@frui.ts/validation";
import { BindingComponent, ExcludeBindingProps, IBindingProps } from "@frui.ts/views";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import { CommonInputProps } from "./commonInputProps";

export abstract class ValidationControlBase<TTarget, TOtherProps = unknown> extends BindingComponent<
  TTarget,
  ExcludeBindingProps<CommonInputProps & TOtherProps> & IBindingProps<TTarget>
> {
  render() {
    return <Observer render={this.renderInner} />;
  }

  protected abstract renderInner(): JSX.Element;

  protected getValidationError() {
    const { noValidation, errorMessage } = this.props;

    if (noValidation === true) {
      return undefined;
    }

    if (errorMessage) {
      return errorMessage;
    }

    // eslint-disable-next-line @typescript-eslint/tslint/config
    const { target, property } = this.props as IBindingProps<TTarget>;
    if (target && property) {
      return getValidationMessage(target, property);
    }

    return undefined;
  }
}
