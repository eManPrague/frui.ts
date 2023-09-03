import type { Awaitable } from "@frui.ts/helpers";
import type React from "react";

export interface ISelectItem {
  value: string | number;
  label: string;
}

export type ViewProps<TViewModel> = { vm: TViewModel };
export type ViewComponent<TViewModel> = React.FunctionComponent<ViewProps<TViewModel>>;

export interface IViewModel<TContext> {
  onInitialize?(context: TContext): Awaitable<unknown>;
  onActivate?(context: TContext): Awaitable<unknown>;
  onNavigate?(context: TContext): Awaitable<unknown>;
  onSearchChanged?(context: TContext): Awaitable<unknown>;
  onDeactivate?(context: TContext): Awaitable<unknown>;

  isVm?: true;
}
