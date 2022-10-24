import { observer } from "mobx-react-lite";
import type { Constructor } from "@frui.ts/helpers";
import type { ViewComponent } from "../types";
import { registerView } from "./viewLocator";

/**
 * Typed helper that simplifies creating views for view models
 * @param render
 * Actual view render function
 * @returns
 * View model-observing view component
 */
export function createViewComponent<TViewModel>(
  render: (vm: TViewModel) => React.ReactElement | null
): ViewComponent<TViewModel> {
  return observer(({ vm }) => render(vm));
}

export function registerViewComponent<TViewModel>(
  viewModelConstructor: Constructor<TViewModel>,
  render: (vm: TViewModel) => React.ReactElement | null
): ViewComponent<TViewModel>;
export function registerViewComponent<TViewModel>(
  viewModelConstructor: Constructor<TViewModel>,
  context: string,
  render: (vm: TViewModel) => React.ReactElement | null
): ViewComponent<TViewModel>;
export function registerViewComponent<TViewModel>(
  viewModelConstructor: Constructor<TViewModel>,
  second: string | ((vm: TViewModel) => React.ReactElement | null),
  render2?: (vm: TViewModel) => React.ReactElement | null
): ViewComponent<TViewModel> {
  return render2
    ? registerViewComponentImpl(viewModelConstructor, second as string, render2)
    : registerViewComponentImpl(viewModelConstructor, undefined, second as (vm: TViewModel) => React.ReactElement | null);
}

function registerViewComponentImpl<TViewModel>(
  viewModelConstructor: Constructor<TViewModel>,
  context: string | undefined,
  render: (vm: TViewModel) => React.ReactElement | null
): ViewComponent<TViewModel> {
  const view = createViewComponent<TViewModel>(render);
  registerView(view, viewModelConstructor, context);
  return view;
}
