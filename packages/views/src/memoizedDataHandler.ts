import { memoize } from "lodash";
import * as React from "react";

export default function createMemoizedHandler(datasetKey: string) {
  return memoize((handler: (data: string) => any) => {
    return (e: React.MouseEvent<HTMLElement>) => {
      const key = e.currentTarget.dataset[datasetKey];
      if (key !== undefined) {
        handler(key);
      }
    };
  });
}
