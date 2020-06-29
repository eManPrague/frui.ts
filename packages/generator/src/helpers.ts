import camelCase from "lodash/camelCase";
import upperFirst from "lodash/upperFirst";

export function pascalCase(input: string) {
  return upperFirst(camelCase(input));
}
