export type BindingTarget = Map<any, any> | Record<string, any>;

export type PropertyName<TTarget> = keyof TTarget & string;

export type BindingProperty<TTarget> = TTarget extends Map<infer K, any> ? K : PropertyName<TTarget>;

export type PropertyType<
  TTarget extends BindingTarget,
  TProperty extends BindingProperty<TTarget>,
  TRestrict = any
> = (TTarget extends Map<any, infer V> ? V : TTarget[TProperty]) & TRestrict;
