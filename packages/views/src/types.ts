import React from "react";

export interface ISelectItem {
  value: string | number;
  label: string;
}

export type ViewProps<TViewModel> = { vm: TViewModel };
export type ViewComponent<TViewModel> = React.FunctionComponent<ViewProps<TViewModel>>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type constructor<T> = Function | (new (...args: any[]) => T);
