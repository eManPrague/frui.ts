"use client";

import type { DependencyList } from "react";
import { useEffect, useRef } from "react";
import { ViewModelLifecycleManager } from "../helpers/viewModelLifecycleManager";
import type { IViewModel } from "../types";
import { ManualPromise } from "@frui.ts/helpers";

export function useViewModel<TContext, TViewModel extends IViewModel<TContext>>(
  factory: () => TViewModel,
  context: TContext,
  dependencies?: DependencyList
) {
  const vmManager = useRef(new ViewModelLifecycleManager(factory));
  const initializedPromise = useRef(new ManualPromise<true>());

  const currentContext = useRef(context);
  currentContext.current = context;

  useEffect(() => {
    void vmManager.current
      .initialize(currentContext.current)
      .then(() => initializedPromise.current.status === "new" && initializedPromise.current.resolve(true));

    return () => {
      void vmManager.current.close(currentContext.current);
    };
  }, []);

  useEffect(() => {
    void vmManager.current.navigate(currentContext.current);
  }, dependencies ?? [context]);

  return { vm: vmManager.current.instance, initialized: initializedPromise.current.promise };
}
