export type BindingTarget = Map<any, any> | Record<string, any>;

export type PropertyName<TTarget> = keyof TTarget & string;

export type BindingProperty<TTarget> = TTarget extends Map<infer K, any> ? K : PropertyName<TTarget>;
// TODO add TypedBindingProperty<TTarget, TType> that will restrict properties only to those with the specified TType

export type PropertyType<
  TTarget extends BindingTarget,
  TProperty extends BindingProperty<TTarget>,
  TRestrict = unknown
> = (TTarget extends Map<any, infer V> ? V : TTarget[TProperty]) & TRestrict;
