import type { LifecycleScreenNavigator, ScreenBase } from "@frui.ts/screens";
import { getNavigator } from "@frui.ts/screens";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";

type constructor<T> = new (...args: any[]) => T;
function createViewModelInstance<TViewModel>(viewModelType: constructor<TViewModel>): TViewModel {
  return new viewModelType();
}

export default function useViewModel<TViewModel extends ScreenBase>(viewModelType: constructor<TViewModel>) {
  const location = useLocation();
  const params = useParams();
  const [viewModel] = useState(() => createViewModelInstance(viewModelType));

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
