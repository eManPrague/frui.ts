import type { BindingTarget, PropertyType, TypedBindingProperty } from "@frui.ts/helpers";
import { ensureObservableProperty, isMap } from "@frui.ts/helpers";
import { action, get, isObservable, isObservableMap, isObservableProp } from "mobx";
import type { IBindingProps } from "./bindingProps";

export function getValue<
  TValueRestriction,
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, TValueRestriction>
>(target: TTarget | undefined, property: TProperty | undefined, ensureObservable = true): TValueRestriction {
  if (!target) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Cannot read property '${property}', because target has not been set`);
  }
  if (property === undefined) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`'property' prop has not been set for target '${target}'`);
  }

  if (isObservableMap(target)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return target.get(property);
  }

  if (!isObservable(target) || !isObservableProp(target, property)) {
    if (isMap<TProperty, PropertyType<TTarget, TProperty>>(target)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-non-null-assertion
      return target.get(property)!;
    } else {
      const value = target[property as keyof TTarget];
      if (ensureObservable) {
        action(ensureObservableProperty)(target, property, value);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return value as any;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return get(target, property);
}

export function setValue<
  TValueRestriction,
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, TValueRestriction>
>(target: TTarget | undefined, property: TProperty | undefined, value: PropertyType<TTarget, TProperty>) {
  if (target && property) {
    action(ensureObservableProperty)(target, property, value);
  }
}

export function useBinding<
  TValueRestriction,
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, TValueRestriction>
>(props: IBindingProps<TValueRestriction, TTarget, TProperty>) {
  const value = getValue<TValueRestriction, TTarget, TProperty>(props.target, props.property);
  const setter = (value: TValueRestriction) => {
    const typedValue = value as PropertyType<TTarget, TProperty>;
    setValue<TValueRestriction, TTarget, TProperty>(props.target, props.property, typedValue);
    if (props.target && props.property) {
      props.onValueChanged?.(typedValue, props.property, props.target);
    }
  };
  return [value, setter] as const;
}
