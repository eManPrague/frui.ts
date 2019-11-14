import { IHasNavigationName } from "..";
import { IChild, IConductor, IScreen } from "../structure/types";

type ScreenActivatedHandler = (screen: IScreen & IChild<IConductor<IScreen>> & IHasNavigationName) => void;

export default {
  pathDelimiter: "/",
  onActiveScreenChanged: undefined as ScreenActivatedHandler | undefined,
};
