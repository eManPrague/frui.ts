import RouteParser from "route-parser";

export type Class = { new (...args: any[]): any };
export type RouteName = string | symbol | Class;

export interface RouteDefinition {
  name: RouteName | RouteName[];
  path: string;
  aliasPaths?: string[];
}

export class Route<TParams> {
  private path: RouteParser<TParams>;
  private aliases?: RouteParser<TParams>[];

  constructor(public readonly name: RouteName, path: string, aliasPaths?: string[]) {
    this.path = new RouteParser<TParams>(path);
    this.aliases = aliasPaths?.map(x => new RouteParser<TParams>(x));
  }

  matchPath(path: string) {
    if (this.aliases?.length) {
      for (const router of this.aliases) {
        const match = router.match(path);
        if (match) {
          return match;
        }
      }
    }

    return this.path.match(path);
  }

  getUrl(params: TParams) {
    const route = this.aliases?.[0] ?? this.path;
    return route.reverse(params);
  }
}
