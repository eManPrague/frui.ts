import type { BindingTarget, PropertyType, TypedBindingProperty } from "@frui.ts/helpers";
import { action, makeObservable } from "mobx";
import React from "react";
import type { WithBindingProps } from "./bindingProps";
import { omitBindingProps } from "./bindingProps";
import { getValue, setValue } from "./useBinding";

/**
 * Base class for all user input controls supporting two-way binding.
 *
 * You should render your custom user input within `BindingComponent` and then use
 * the functions provided by `BindingComponent` for simple two-way binding:
 * * Use the [[value]] property in the `render` function (together with Mobx `Observer`)
 * to access bound value.
 * * Call [[setValue]] after user input with the new value to update the target entity.
 *
 * @see [[TextBox]] for example
 *
 * @typeparam TProps Type of the additonal props
 * @typeparam TBindingTypeRestriction Type of the bound value
 * @typeparam TTarget Type of the targete entity for binding
 * @typeparam TProperty Bound property name
 */
export abstract class BindingComponent<
  TProps,
  TBindingTypeRestriction,
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, TBindingTypeRestriction>,
> extends React.Component<WithBindingProps<TProps, TBindingTypeRestriction, TTarget, TProperty>> {
  constructor(props: WithBindingProps<TProps, TBindingTypeRestriction, TTarget, TProperty>) {
    super(props);
    makeObservable(this);
  }

  /**
   * Returns `props` excluding properties required for binding.
   *
   * This makes it easy to pass the props to the inner user control:
   * ```ts
   * render() {
   *  return <input {...this.inheritedProps} />;
   * }
   * ```
   */
  protected get inheritedProps() {
    return omitBindingProps(this.props);
  }

  /** Returns value of the bound property */
  protected get value() {
    if (!this.props.target) {
      console.warn("'target' has not been set");
      return undefined;
    }

    return getValue<TBindingTypeRestriction, TTarget, TProperty>(this.props.target, this.props.property);
  }

  /** Sets the provided value to the bound property  */
  @action.bound
  protected setValue(value: TBindingTypeRestriction) {
    const { target, property, onValueChanged } = this.props;

    const typedValue = value as PropertyType<TTarget, TProperty>;
    setValue<TBindingTypeRestriction, TTarget, TProperty>(target, property, typedValue);
    onValueChanged?.(typedValue, property as TProperty, target as TTarget);
  }
}
