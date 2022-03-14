import type { LifecycleScreenNavigator, ScreenBase } from "@frui.ts/screens";
import { getNavigator } from "@frui.ts/screens";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";

// use custom context provider to use DI container for createInstance
export const DependenciesContext = React.createContext({ createInstance: activateInstance });

type constructor<T> = new (...args: any[]) => T;
function activateInstance<T>(type: constructor<T>): T {
  return new type();
}

export default function useViewModel<TViewModel extends ScreenBase>(viewModelType: constructor<TViewModel>) {
  const location = useLocation();
  const params = useParams();
  const { createInstance } = useContext(DependenciesContext);
  const [viewModel] = useState(() => createInstance(viewModelType));

  useEffect(() => {
    const navigator = getNavigator<LifecycleScreenNavigator>(viewModel);
    if (navigator?.deactivate) {
      return () => void navigator.deactivate?.(true);
    }
  }, []);

  useEffect(() => {
    const navigator = getNavigator<LifecycleScreenNavigator>(viewModel);
    if (navigator) {
      void navigator.navigate([{ name: location.pathname, params: params }], location);
    }
  }, [location]);

  return viewModel;
}

export function createView<TViewModel extends ScreenBase>(
  viewModelType: constructor<TViewModel>,
  view: (props: { vm: TViewModel }) => JSX.Element
) {
  const ObserverView = observer(view);
  return () => {
    const vm = useViewModel<TViewModel>(viewModelType);
    return <ObserverView vm={vm} />;
  };
}
