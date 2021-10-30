import memoize from "lodash/memoize";
import type { SyntheticEvent } from "react";

export default function createMemoizedHandler(datasetKey: string) {
  return memoize((handler: (data: string) => any) => {
    return (e: SyntheticEvent<HTMLElement>) => {
      const key = e.currentTarget.dataset[datasetKey];
      if (key !== undefined) {
        handler(key);
      }
    };
  });
}
