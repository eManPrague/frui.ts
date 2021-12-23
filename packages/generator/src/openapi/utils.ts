import { IPathConfig } from "./types";

export function patternMath(pattern: string | RegExp, name: string): boolean {
  if (typeof pattern === "string" && pattern === name) {
    return true;
  } else if (pattern instanceof RegExp && pattern.test(name)) {
    return true;
  } else {
    return false;
  }
}

export function getPath(pathConfig: IPathConfig | string, name: string, defaultPath?: string) {
  let finalPath;

  if (typeof pathConfig === "string") {
    finalPath = pathConfig;
  } else {
    for (const path in pathConfig) {
      const pattern = pathConfig[path];
      if (patternMath(pattern, name)) {
        finalPath = path;
      }
    }
  }

  return finalPath ?? defaultPath ?? "./";
}
