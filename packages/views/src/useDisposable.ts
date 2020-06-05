import { useEffect } from "react";
import { IDisposable } from "@frui.ts/helpers";

export default function useDisposable(...dependencies: IDisposable[]) {
  useEffect(
    () => () => {
      dependencies.forEach(x => x.dispose());
    },
    []
  );
}
