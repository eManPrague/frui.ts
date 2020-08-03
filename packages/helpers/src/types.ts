export type PropertyName<TTarget> = keyof TTarget & string;

export type BindingProperty<TTarget> = TTarget extends Map<infer K, any> ? K : PropertyName<TTarget>;
