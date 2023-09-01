import fs from "fs";
import { camelCase, upperFirst } from "lodash-es";
import path from "path";

export function pascalCase(input: string) {
  return upperFirst(camelCase(input));
}

export async function readJson<T = unknown>(relativePath: string) {
  const fullPath = path.join(process.cwd(), relativePath);
  const content = await fs.promises.readFile(fullPath, "utf8");
  return JSON.parse(content) as T;
}

export function getRelativePath(source: string, target: string) {
  if (source === target) {
    return "./";
  }

  const sourceParts = source.split("/");
  const targetParts = target.split("/");

  let commonPartIndex = 0;
  while (
    sourceParts[commonPartIndex] === targetParts[commonPartIndex] &&
    commonPartIndex < sourceParts.length &&
    commonPartIndex < targetParts.length
  ) {
    commonPartIndex++;
  }

  const popSteps = new Array<string>(sourceParts.length - commonPartIndex).fill("..");
  const path = [...popSteps, ...targetParts.slice(commonPartIndex - targetParts.length)];

  return path.join("/");
}
