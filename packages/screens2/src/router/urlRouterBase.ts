import PathElement from "../models/pathElements";
import { ScreenNavigator } from "../navigation/types";
import Router from "./router";

const PATH_SEPARATOR = "/";
const ELEMENT_REGEX = /^(?<name>[\w-]+)(\[(?<params>\S+)\])?$/;

export default abstract class UrlRouterBase implements Router {
  rootNavigator?: ScreenNavigator;

  constructor(rootNavigator?: ScreenNavigator) {
    this.rootNavigator = rootNavigator;
  }

  async initialize() {
    const pathElements = this.rootNavigator?.getNavigationPath();
    if (pathElements) {
      const path = pathElements.map(x => this.serializePathElement(x)).join(PATH_SEPARATOR);
      await this.persistPath(path);
    }
  }

  protected abstract persistPath(path: string): Promise<void>;

  async setPath(path: string) {
    const elements = path.split(PATH_SEPARATOR).map(x => this.deserializePathElement(x) ?? { name: "parse-error" });
    await this.rootNavigator?.navigate(elements);
  }

  serializePathElement(element: PathElement): string {
    if (element.params) {
      const values = Object.entries(element.params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`);
      return `${element.name}[${values.join(",")}]`;
    } else {
      return element.name;
    }
  }

  deserializePathElement(text: string): PathElement | undefined {
    const match = ELEMENT_REGEX.exec(text)?.groups;

    if (!match) {
      return undefined;
    }

    let paramsObject: Record<string, any> | undefined = undefined;
    if (match.params) {
      const pairs = match.params.split(",").map(x => decodeURIComponent(x).split("=", 2) as [string, string]);
      paramsObject = Object.fromEntries(pairs);
    }

    return {
      name: match.name,
      params: paramsObject,
    };
  }
}
