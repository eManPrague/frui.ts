import type { BindingTarget, PropertyType, TypedBindingProperty } from "@frui.ts/helpers";

/**
 * Base props required for two-way binding.
 *
 * Every control using Frui.ts two-way binding should use props implementing `IBindingProps`
 *
 * @typeparam TTypeRestriction Type of the value assigned in `TTarget[TProperty]`. Use this to restrict possible value types if needed.
 * @typeparam TTarget Type of the target entity
 * @typeparam TProperty Helper type of the property key. This shall be inferred in most cases.
 */
export interface IBindingProps<
  TTypeRestriction,
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, TTypeRestriction>
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
  onValueChanged?: (value: PropertyType<TTarget, TProperty>, property: TProperty, target: TTarget) => void;
}

export type ExcludeBindingProps<T> = Omit<T, keyof IBindingProps<any, any, any>>;

export type WithBindingProps<
  T,
  TTypeRestriction,
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, any>
> = IBindingProps<TTypeRestriction, TTarget, TProperty> & Omit<T, keyof IBindingProps<TTypeRestriction, TTarget, TProperty>>;

export function omitBindingProps<T>(props: T): ExcludeBindingProps<T> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { target, property, onValueChanged, ...rest } = props as WithBindingProps<T, any, any, any>;

  return rest as ExcludeBindingProps<T>;
}
