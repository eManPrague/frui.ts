import type { BindingTarget, PropertyName } from "@frui.ts/helpers";
import { getValidationMessage } from "@frui.ts/validation";
import type { ExcludeBindingProps, IBindingProps } from "@frui.ts/views";
import { BindingComponent } from "@frui.ts/views";
import { Observer } from "mobx-react-lite";
import React from "react";
import type { CommonInputProps } from "./commonInputProps";

type TProps<TTarget, TOtherProps> = ExcludeBindingProps<CommonInputProps & TOtherProps> & IBindingProps<TTarget>;

export abstract class ValidationControlBase<TTarget extends BindingTarget, TOtherProps = unknown> extends BindingComponent<
  TTarget,
  TProps<TTarget, TOtherProps>
> {
  render() {
    return <Observer render={this.renderInner} />;
  }

  protected abstract renderInner(): React.ReactElement | null;

  protected get inheritedProps(): Partial<TProps<TTarget, TOtherProps>> {
    const { target, property, onValueChanged, noValidation, errorMessage, ...otherProps } = this.props;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return otherProps as any;
  }

  protected getValidationError() {
    const { noValidation, errorMessage } = this.props;

    if (noValidation === true) {
      return undefined;
    }

    if (errorMessage) {
      return errorMessage;
    }

    const target = this.props.target as TTarget | undefined;
    const property = this.props.property as PropertyName<TTarget>;

    if (target && property) {
      return getValidationMessage(target, property);
    }

    return undefined;
  }
}
