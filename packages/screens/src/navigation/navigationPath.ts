import { stringify } from "query-string";
import NavigationConfiguration from "./navigationConfiguration";

export interface NavigationPath {
  readonly path?: string;
  readonly params?: any;
  readonly isClosed: boolean;
}

export function combinePathString(base = "", path = "") {
  const delimiter = base && path ? NavigationConfiguration.pathDelimiter : "";
  return base + delimiter + path;
}

export function combinePath(base: NavigationPath, path: string, params: any = undefined, isClosed = false): NavigationPath {
  return {
    path: combinePathString(base.path, path),
    params: base.params && params ? Object.assign({}, base.params, params) : base.params || params,
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

export function appendQueryString(path: string, query?: any) {
  if (query) {
    const queryText = stringify(query);
    if (queryText) {
      return `${path}?${queryText}`;
    }
  }
  return path;
}
