import type React from "react";

export interface ISelectItem {
  value: string | number;
  label: string;
}

export type ViewProps<TViewModel> = { vm: TViewModel };
export type ViewComponent<TViewModel> = React.FunctionComponent<ViewProps<TViewModel>>;

export interface IViewModel<TContext> {
  onInitialize?(context: TContext): Promise<unknown> | unknown;
  onActivate?(context: TContext): Promise<unknown> | unknown;
  onNavigate?(context: TContext): Promise<unknown> | unknown;
  onSearchChanged?(context: TContext): Promise<unknown> | unknown;
  onDeactivate?(context: TContext): Promise<unknown> | unknown;
}
