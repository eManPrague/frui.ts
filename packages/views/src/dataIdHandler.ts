import { memoize } from "lodash";
import * as React from "react";

function dataIdHandler(handler: (id: number) => any) {
  return (e: React.MouseEvent<HTMLElement>) => {
    const id = +e.currentTarget.dataset.id;
    handler(id);
  };
}

export default memoize(dataIdHandler);
