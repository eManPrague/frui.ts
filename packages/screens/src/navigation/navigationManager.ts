import { IHasNavigationName } from "..";
import { IChild, IConductor, IScreen } from "../structure/types";

type ScreenActivatedHandler = (screen: IScreen & IChild<IConductor<IScreen>> & IHasNavigationName) => void;

export default {
  pathDelimiter: "/",
  onScreenActivated: undefined as ScreenActivatedHandler | undefined,
};
