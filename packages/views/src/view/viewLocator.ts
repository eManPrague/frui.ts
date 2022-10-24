import type { ComponentType } from "react";
import type { Constructor } from "@frui.ts/helpers";

type viewComponent<TViewModel> = ComponentType<{ vm: TViewModel }>;
type ContextDictionary = Partial<Record<string, viewComponent<any>>>;

const DEFAULT_CONTEXT = "default";

// viewsRegistry is singleton
const viewsRegistry = new Map<Constructor<unknown>, ContextDictionary>();

export function registerView<TViewModel>(
  view: viewComponent<TViewModel>,
  viewModelConstructor: Constructor<TViewModel>,
  context = DEFAULT_CONTEXT
): viewComponent<TViewModel> {
  const currentViewModelViews = viewsRegistry.get(viewModelConstructor);
  if (currentViewModelViews) {
    currentViewModelViews[context] = view;
  } else {
    viewsRegistry.set(viewModelConstructor, { [context]: view });
  }
  return view;
}

// todo memoize
export function getView<TViewModel = unknown>(
  viewModelConstructor: Constructor<TViewModel>,
  context = DEFAULT_CONTEXT
): viewComponent<TViewModel> {
  const currentViewModelViews = viewsRegistry.get(viewModelConstructor);

  if (!currentViewModelViews) {
    throw new Error("No view has been registered for view model " + viewModelConstructor.name);
  }

  const view = currentViewModelViews[context];
  if (!view) {
    throw new Error(`No view has been registered for view model ${viewModelConstructor.name} and context ${context}`);
  }

  return view;
}

export function tryGetView<TViewModel = unknown>(
  viewModelConstructor: Constructor<TViewModel>,
  context = DEFAULT_CONTEXT
): viewComponent<TViewModel> | null {
  const currentViewModelViews = viewsRegistry.get(viewModelConstructor);

  if (!currentViewModelViews) {
    return null;
  }

  const view = currentViewModelViews[context];
  if (!view) {
    return null;
  }

  return view;
}
