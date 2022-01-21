import { BindingProperty, PropertyName } from "@frui.ts/helpers";
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

  protected get inheritedProps() {
    const { target, property, onValueChanged, noValidation, errorMessage, ...otherProps } = this.props;

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

    const target = this.props.target as TTarget;
    const property = (this.props.property as BindingProperty<TTarget>) as PropertyName<TTarget>;

    if (target && property) {
      return getValidationMessage(target, property);
    }

    return undefined;
  }
}
