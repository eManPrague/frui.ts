import NavigationConfiguration from "./navigationConfiguration";

export interface NavigationPath {
  readonly path?: string;
  readonly params?: any;
  readonly isClosed: boolean;
}

export function combinePath(base: NavigationPath, path: string, isClosed = false): NavigationPath {
  return {
    path: base.path + NavigationConfiguration.pathDelimiter + path,
    params: base.params,
    isClosed: base.isClosed || isClosed,
  };
}

export function splitUrlSegments(
  path: string | undefined,
  delimiter = NavigationConfiguration.pathDelimiter
): [string?, string?] {
  if (!path) {
    return [undefined, undefined];
  }

  if (path.startsWith(delimiter)) {
    path = path.substr(1);
  }

  const delimiterIndex = path.indexOf(delimiter);
  if (delimiterIndex < 0 || delimiterIndex === path.length - 1) {
    return [path, undefined];
  } else {
    return [path.substring(0, delimiterIndex), path.substring(delimiterIndex + 1)];
  }
}
