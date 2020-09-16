import { BindingProperty } from "@frui.ts/helpers";
import { action } from "mobx";
import * as React from "react";
import { ExcludeBindingProps, IBindingProps, omitBindingProps } from "./bindingProps";
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
 * @typeparam TTarget Type of the targete entity for binding
 * @typeparam TProps Type of the props. Should implement [[IBindingProps]] with information required for binding.
 */
export abstract class BindingComponent<TTarget, TProps extends IBindingProps<TTarget>> extends React.Component<TProps> {
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
  protected get inheritedProps(): Partial<ExcludeBindingProps<TProps>> {
    return omitBindingProps(this.props);
  }

  /** Returns value of the bound property */
  protected get value() {
    if (!this.props.target) {
      console.warn("'target' has not been set");
      return undefined;
    }
    return getValue(this.props.target as TTarget, this.props.property);
  }

  /** Sets the provided value to the bound property  */
  @action.bound
  protected setValue(value: any) {
    const { target, property, onValueChanged } = this.props;
    setValue(target as TTarget, property, value);
    onValueChanged?.(value, property as BindingProperty<TTarget>, target as TTarget);
  }
}
