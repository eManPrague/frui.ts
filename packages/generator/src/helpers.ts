import camelCase from "lodash/camelCase";
import upperFirst from "lodash/upperFirst";

export function pascalCase(input: string) {
  return upperFirst(camelCase(input));
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
