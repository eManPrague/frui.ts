import { BindingTarget, BindingProperty, PropertyType } from "@frui.ts/helpers";

/**
 * Base props required for two-way binding.
 *
 * Every control using Frui.ts two-way binding should use props implementing `IBindingProps`
 *
 * @typeparam TTarget Type of the target entity
 * @typeparam TProperty Helper type of the property key. This shall be inferred in most cases.
 * @typeparam TValue Type of the value assigned in `TTarget[TProperty]`. Use this to restrict possible value types if needed.
 */
export interface IBindingProps<
  TTarget extends BindingTarget,
  TProperty extends BindingProperty<TTarget> = BindingProperty<TTarget>,
  TValue = PropertyType<TTarget, TProperty>
> {
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
  onValueChanged?: (value: TValue, property: TProperty, target: TTarget) => void;
}

export type ExcludeBindingProps<T> = Omit<T, keyof IBindingProps<any>>;

export function omitBindingProps<TProps extends IBindingProps<any, any>>(props: TProps): ExcludeBindingProps<TProps> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { target, property, onValueChanged, ...rest } = props;

  return rest;
}
