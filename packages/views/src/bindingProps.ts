import { BindingProperty, PropertyType } from "@frui.ts/helpers";

/**
 * Base props required for two-way binding.
 *
 * Every control using Frui.ts two-way binding should use props implementing `IBindingProps`
 *
 * @typeparam TTarget Type of the target entity
 */
export interface IBindingProps<TTarget, TProperty extends BindingProperty<TTarget> = BindingProperty<TTarget>> {
  /** Target entity for the binding. The entity should be Mobx `observable`. */
  target?: TTarget;

  /** Name of the bound property on the target entity */
  property?: TProperty;

  /**
   * Event handler called when the value of the control is changed
   *
   * @param value  New value coming from the input control
   * @param property  Name of the bound property on the target entity
   * @param target  The target entity for the binding
   */
  onValueChanged?: (value: PropertyType<TTarget, TProperty>, property: TProperty, target: TTarget) => void;
}

export type ExcludeBindingProps<T> = Omit<T, keyof IBindingProps<any>>;
