import type { ClassConstructor, ClassTransformOptions } from "class-transformer";
import { instanceToPlain, plainToClass } from "class-transformer";

/**
 * Serializes given object to a JSON string.
 */
export function serialize<T>(object: T, options?: ClassTransformOptions): string;
export function serialize<T>(object: T[], options?: ClassTransformOptions): string;
export function serialize<T>(object: T, options?: ClassTransformOptions): string {
  return JSON.stringify(instanceToPlain(object, options));
}

/**
 * Deserializes given JSON string to a object of the given class.
 */
export function deserialize<T>(cls: ClassConstructor<T>, json: string, options?: ClassTransformOptions): T {
  return plainToClass(cls, JSON.parse(json), options);
}

/**
 * Deserializes given JSON string to an array of objects of the given class.
 */
export function deserializeArray<T>(cls: ClassConstructor<T>, json: string, options?: ClassTransformOptions): T[] {
  const array = JSON.parse(json) as unknown[];
  return array.map(value => plainToClass(cls, value, options));
}

export function mapToEntity<TSource, TTarget>(
  source: TSource,
  targetType: ClassConstructor<TTarget>,
  options?: ClassTransformOptions
): TTarget {
  const plain = instanceToPlain(source, options);
  return plainToClass(targetType, plain, options);
}

export function initObject<T>(target: T, properties: Partial<T>): T {
  return Object.assign(target, properties);
}
