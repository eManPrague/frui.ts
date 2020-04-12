import { IScreen } from "../structure/types";
import { ICanNavigate } from "./types";

type ScreenChangedHandler = (screen: IScreen & ICanNavigate) => void;

export default {
  pathDelimiter: "/",
  onScreenChanged: undefined as ScreenChangedHandler | undefined,
};
