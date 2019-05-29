export interface NavigationPath {
  readonly path: string;
  readonly isClosed: boolean;
}

const pathDelimiter = "/";

export function combineNavigationPath(base: string, path: string) {
  if (base) {
    return path ? base + pathDelimiter + path : base;
  }
  else {
    return path;
  }
}

export function splitNavigationPath(path: string): [string, string] {
  const delimiterIndex = path.indexOf(pathDelimiter);
  if (delimiterIndex < 0 || delimiterIndex === path.length - 1) {
    return [path, undefined];
  }
  else {
    return [path.substring(0, delimiterIndex), path.substring(delimiterIndex + 1)];
  }
}
