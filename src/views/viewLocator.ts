import { FunctionComponent } from "react";

type constructor<T> = new (...args: any[]) => T;
type functionalView<TViewModel> = FunctionComponent<{ vm: TViewModel }>;

// viewsRegistry is singleton
const viewsRegistry = new Map<constructor<{}>, Record<string, functionalView<any>>>();

export function registerView<TViewModel>(view: functionalView<TViewModel>, viewModelConstructor: constructor<TViewModel>, context = "default") {
  const currentViewModelViews = viewsRegistry.get(viewModelConstructor);
  if (currentViewModelViews) {
    currentViewModelViews[context] = view;
  }
  else {
    viewsRegistry.set(viewModelConstructor, { [context]: view });
  }
  return view;
}

// todo memoize
export function getView(viewModelConstructor: constructor<{}>, context = "default") {
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
