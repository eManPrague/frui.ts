import { BindingProperty, ensureObservableProperty, PropertyName, PropertyType } from "@frui.ts/helpers";
import { action, get, isObservable, isObservableMap, isObservableProp } from "mobx";
import { IBindingProps } from "./bindingProps";

export function getValue<TTarget, TProperty extends BindingProperty<TTarget>>(
  bindingProps: IBindingProps<TTarget, TProperty>,
  ensureObservable = true
) {
  const target = bindingProps.target as TTarget;
  const property = bindingProps.property as PropertyName<TTarget>;

  if (!target) {
    console.warn("'target' has not been set");
    return undefined;
  }
  if (property === undefined) {
    throw new Error("'property' prop has not been set");
  }

  if (isObservableMap(target)) {
    return target.get(property);
  }

  if (!isObservable(target) || !isObservableProp(target, property)) {
    if (ensureObservable) {
      action(ensureObservableProperty)(target, property, target[property]);
    } else {
      return target[property];
    }
  }

  return get(target, property);
}

export function setValue<TTarget, TProperty extends BindingProperty<TTarget>>(
  bindingProps: IBindingProps<TTarget, TProperty>,
  value: PropertyType<TTarget, TProperty>
) {
  const target = bindingProps.target as TTarget;
  const property = bindingProps.property as PropertyName<TTarget>;

  if (target && property) {
    action(ensureObservableProperty)(target, property, value);

    bindingProps.onValueChanged?.(value, property as any, target);
  }
}

export function useBinding<TTarget, TProperty extends BindingProperty<TTarget>>(bindingProps: IBindingProps<TTarget, TProperty>) {
  const value = getValue(bindingProps);
  const setter = (value: PropertyType<TTarget, TProperty>) => setValue(bindingProps, value);
  return [value, setter] as const;
}
