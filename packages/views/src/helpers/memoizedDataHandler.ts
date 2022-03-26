import { memoize } from "lodash-es";
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
