import type { DependencyList } from "react";
import { useEffect, useRef } from "react";
import { ViewModelLifecycleManager } from "../helpers/viewModelLifecycleManager";
import type { IViewModel } from "../types";

export function useViewModel<TContext, TViewModel extends IViewModel<TContext>>(
  factory: () => TViewModel,
  context: TContext,
  dependencies?: DependencyList
) {
  const vmManager = useRef(new ViewModelLifecycleManager(factory));

  const currentContext = useRef(context);
  currentContext.current = context;

  useEffect(() => {
    void vmManager.current.initialize(currentContext.current);

    return () => {
      void vmManager.current.close(currentContext.current);
    };
  }, []);

  useEffect(() => {
    void vmManager.current.navigate(currentContext.current);
  }, dependencies ?? [context]);

  return vmManager.current.instance;
}
