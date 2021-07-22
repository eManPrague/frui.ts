import { NAVIGATE_EVENT_NAME } from "@frui.ts/screens";
import { MouseEvent, MouseEventHandler } from "react";

export function hrefParams(url: string, onClick?: MouseEventHandler<any>) {
  return {
    href: url,
    onClick: function (event: MouseEvent<unknown>) {
      event.preventDefault();
      onClick?.(event);
      window.dispatchEvent(new CustomEvent(NAVIGATE_EVENT_NAME, { detail: { url } }));
    },
  };
}
