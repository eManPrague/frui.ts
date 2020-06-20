export type PropertyName<TTarget> = TTarget extends Map<string, any> ? string : keyof TTarget & string;
