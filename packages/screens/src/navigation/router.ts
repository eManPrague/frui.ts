import { IScreen } from "../structure/types";
import { combinePath, appendQueryString } from "./navigationPath";
import { ICanNavigate, INavigationParent } from "./types";
import NavigationConfiguration from "./navigationConfiguration";
import navigationConfiguration from "./navigationConfiguration";

export default class Router {
  static getChildUrlFactory<TChild extends IScreen = IScreen>(
    parent: ICanNavigate & INavigationParent<TChild>,
    defaultParams?: any
  ) {
    const currentPath = parent.getNavigationPath();

    return (child: TChild | string | number, childParams?: any) => {
      const navigationName = (child as TChild).navigationName || (child as string);
      const path = combinePath(currentPath, navigationName, childParams);
      const url = path.path ? appendQueryString(path.path, childParams ? path.params : defaultParams || path.params) : undefined;
      return navigationConfiguration.hashPrefix + url;
    };
  }
}
