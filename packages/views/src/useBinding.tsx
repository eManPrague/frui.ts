import { BindingProperty, ensureObservableProperty, PropertyName, PropertyType } from "@frui.ts/helpers";
import { action, get, isObservable, isObservableMap, isObservableProp } from "mobx";

export function getValue<TTarget, TProperty extends PropertyName<TTarget>>(
  target: TTarget | undefined,
  property: TProperty | undefined,
  // eslint-disable-next-line @typescript-eslint/tslint/config
  ensureObservable?: boolean
): TTarget[TProperty];
export function getValue<TKey, TValue, TTarget extends Map<TKey, TValue>>(
  target: TTarget | undefined,
  key: TKey | undefined
): TValue;
export function getValue<TTarget, TProperty extends BindingProperty<TTarget>>(
  target: TTarget | undefined,
  property: TProperty | undefined,
  // eslint-disable-next-line @typescript-eslint/tslint/config
  ensureObservable?: boolean
): PropertyType<TTarget, TProperty>;

export function getValue<TTarget, TProperty extends BindingProperty<TTarget>>(
  target: TTarget | undefined,
  property: TProperty | undefined,
  ensureObservable = true
): PropertyType<TTarget, TProperty> {
  if (!target) {
    throw new Error("'target' prop has not been set");
  }
  if (property === undefined) {
    throw new Error("'property' prop has not been set");
  }

  if (isObservableMap(target)) {
    return target.get(property);
  }
  const propertyName = property as PropertyName<TTarget>;

  if (!isObservable(target) || !isObservableProp(target, propertyName)) {
    if (ensureObservable) {
      action(ensureObservableProperty)(target, propertyName, target[propertyName]);
    } else {
      return target[propertyName] as any;
    }
  }

  return get(target, propertyName);
}

export function setValue<TTarget, TProperty extends PropertyName<TTarget>>(
  target: TTarget | undefined,
  property: TProperty | undefined,
  value: TTarget[TProperty]
): void;
export function setValue<TKey, TValue, TTarget extends Map<TKey, TValue>>(
  target: TTarget | undefined,
  key: TKey | undefined,
  value: TValue
): void;
export function setValue<TTarget, TProperty extends BindingProperty<TTarget>>(
  target: TTarget | undefined,
  property: TProperty | undefined,
  value: PropertyType<TTarget, TProperty>
): void;

export function setValue<TTarget, TProperty extends BindingProperty<TTarget>>(
  target: TTarget | undefined,
  property: TProperty | undefined,
  value: PropertyType<TTarget, TProperty>
) {
  if (target && property) {
    action(ensureObservableProperty)(target, property as PropertyName<TTarget>, value);
  }
}

export function useBinding<TTarget, TProperty extends PropertyName<TTarget>>(
  target: TTarget | undefined,
  property: TProperty | undefined
): readonly [TTarget[TProperty], (value: TTarget[TProperty]) => void];

export function useBinding<TKey, TValue, TTarget extends Map<TKey, TValue>>(
  target: TTarget | undefined,
  key: TKey | undefined
): readonly [TValue, (value: TValue) => void];
export function useBinding<TTarget, TProperty extends BindingProperty<TTarget>>(
  target: TTarget | undefined,
  property: TProperty | undefined
): readonly [PropertyType<TTarget, TProperty>, (value: PropertyType<TTarget, TProperty>) => void];

export function useBinding<TTarget, TProperty extends BindingProperty<TTarget>>(
  target: TTarget | undefined,
  property: TProperty | undefined
) {
  const value = getValue(target as any, property);
  const setter = (value: PropertyType<TTarget, TProperty>) => setValue(target as any, property, value);
  return [value, setter] as const;
}
