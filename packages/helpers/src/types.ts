export type Awaitable<T> = T | PromiseLike<T>;

export type Constructor<T, Arguments extends unknown[] = any[]> = new (...arguments_: Arguments) => T;

export type BindingTarget = Map<any, any> | Record<string, any>;

export type ConditionalKeys<Base, Condition> = NonNullable<
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
  }[keyof Base]
>;

export type PropertyName<TTarget, TTypeRestriction = any> = ConditionalKeys<TTarget, TTypeRestriction> & string;

export type TypedBindingProperty<TTarget, TTypeRestriction> = TTarget extends Map<infer K, infer TValue>
  ? TValue extends TTypeRestriction
    ? K | undefined
    : never
  : PropertyName<TTarget, TTypeRestriction>;

export type ExtractTypeRestriction<T> = T extends TypedBindingProperty<any, infer TTypeRestriction>
  ? TTypeRestriction
  : T extends PropertyName<any, infer TTypeRestriction>
  ? TTypeRestriction
  : never;

export type PropertyType<
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, any>
> = TTarget extends Map<TProperty, infer TValue> ? TValue | undefined : TTarget[TProperty] & ExtractTypeRestriction<TProperty>;
