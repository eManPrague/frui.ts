import type { ClassTransformOptions } from "class-transformer";
import { classToPlain, serialize } from "class-transformer";

const serializeOptions: ClassTransformOptions = {
  excludePrefixes: ["_"],
};

export function serializeEntity(value: any): string {
  return serialize(value, serializeOptions);
}

export function entityToPlain(entity: any) {
  return classToPlain(entity, serializeOptions);
}

export function entityToFormData(item: any) {
  const payload = entityToPlain(item);

  const data = new FormData();
  for (const [key, value] of Object.entries<string | undefined>(payload)) {
    if (value !== undefined) {
      data.append(key, value);
    }
  }

  return data;
}
