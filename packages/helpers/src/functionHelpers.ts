/**
 * Simple wrapper over 'func.bind(target)'. This helps TypeScript properly infer function's return type.
 * @param func The function to be bound.
 * @param target An object to which the this keyword can refer inside the new function.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function bind<T>(func: T & Function, target: any): T {
  return func.bind(target);
}
