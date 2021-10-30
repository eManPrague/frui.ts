import type { SyntheticEvent } from "react";

export default function preventDefault(action: () => any) {
  return function (event: SyntheticEvent) {
    event.preventDefault();
    event.stopPropagation();
    action();
  };
}
