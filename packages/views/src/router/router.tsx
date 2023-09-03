/* eslint-disable @typescript-eslint/ban-types */
import type {
  AnyRoute,
  AnySearchSchema,
  InferFullSearchSchema,
  IsAny,
  NoInfer,
  ParsePathParams,
  ResolveFullSearchSchema,
  RootRouteId,
  RouteContext,
  RouteOptions,
  RouterContext,
} from "@tanstack/react-router";
import { Outlet, RootRoute, Route } from "@tanstack/react-router";
import React from "react";
import { ViewModelLifecycleManager } from "../helpers/viewModelLifecycleManager";
import View from "../view/view";
import type { IRouteViewModel, NavigationContext, NoParams } from "./types";

function buildViewModelOptions<
  TParentRoute extends AnyRoute = AnyRoute,
  TPath extends string = string,
  // TFullPath extends ResolveFullPath<TParentRoute, TPath> = ResolveFullPath<TParentRoute, TPath>,
  TCustomId extends string = string,
  // TId extends ResolveId<TParentRoute, TCustomId, TPath> = ResolveId<TParentRoute, TCustomId, TPath>,
  TSearchSchema extends AnySearchSchema = {},
  TFullSearchSchema extends AnySearchSchema = ResolveFullSearchSchema<TParentRoute, TSearchSchema>,
  TParams extends Record<ParsePathParams<TPath>, any> = Record<ParsePathParams<TPath>, string>,
  TAllParams extends MergeFromParent<TParentRoute["__types"]["allParams"], TParams> = MergeFromParent<
    TParentRoute["__types"]["allParams"],
    TParams
  >,
  TParentContext extends TParentRoute["__types"]["routeContext"] = TParentRoute["__types"]["routeContext"],
  TAllParentContext extends TParentRoute["__types"]["context"] = TParentRoute["__types"]["context"],
  TRouteContext extends RouteContext = RouteContext,
  TContext extends MergeFromParent<TParentRoute["__types"]["context"], TRouteContext> = MergeFromParent<
    TParentRoute["__types"]["context"],
    TRouteContext
  >,
  // TRouterContext extends AnyContext = AnyContext,
  // TChildren = unknown,
  // TRoutesInfo extends DefaultRoutesInfo = DefaultRoutesInfo,
  TViewModel extends IRouteViewModel<TAllParams, TFullSearchSchema> = IRouteViewModel<TAllParams, TFullSearchSchema>,
>(vmFactory: () => TViewModel) {
  const vmManager = new ViewModelLifecycleManager<NavigationContext<TAllParams, TFullSearchSchema>, TViewModel>(vmFactory);

  // since the current router does not help here,
  // we need to manually handle situation when a route remains selected,
  // but only search or params change.
  // If onLoad is called sooner than onLoaded callback, we should not call the disposer logic.
  let loadCounter = 0;

  return {
    async onLoad(context) {
      await vmManager.initialize({
        isPreload: context.preload,
        params: context.params,
        search: context.search,
      });

      if (!context.preload) {
        loadCounter++;
        void vmManager.navigate({ params: context.params, search: context.search });
      }
    },
    onLoaded() {
      return context => {
        if (--loadCounter === 0) {
          void vmManager.close({ params: context.params, search: context.search });
        }
      };
    },
    component: () => (
      <View vm={vmManager.instance}>
        <Outlet />
      </View>
    ),
  } as Partial<
    RouteOptions<
      TParentRoute,
      TCustomId,
      TPath,
      InferFullSearchSchema<TParentRoute>,
      TSearchSchema,
      TFullSearchSchema,
      TParentRoute["__types"]["allParams"],
      TParams,
      TAllParams,
      TParentContext,
      TAllParentContext,
      TRouteContext,
      TContext
    >
  >;
}

export function buildRoute<
  TParentRoute extends AnyRoute = AnyRoute,
  TPath extends string = string,
  // TFullPath extends ResolveFullPath<TParentRoute, TPath> = ResolveFullPath<TParentRoute, TPath>,
  TCustomId extends string = string,
  // TId extends ResolveId<TParentRoute, TCustomId, TPath> = ResolveId<TParentRoute, TCustomId, TPath>,
  TSearchSchema extends AnySearchSchema = {},
  TFullSearchSchema extends AnySearchSchema = ResolveFullSearchSchema<TParentRoute, TSearchSchema>,
  TParams extends Record<ParsePathParams<TPath>, any> = Record<ParsePathParams<TPath>, string>,
  TAllParams extends MergeFromParent<TParentRoute["__types"]["allParams"], TParams> = MergeFromParent<
    TParentRoute["__types"]["allParams"],
    TParams
  >,
  TParentContext extends TParentRoute["__types"]["routeContext"] = TParentRoute["__types"]["routeContext"],
  TAllParentContext extends TParentRoute["__types"]["context"] = TParentRoute["__types"]["context"],
  TRouteContext extends RouteContext = RouteContext,
  TContext extends MergeFromParent<TParentRoute["__types"]["context"], TRouteContext> = MergeFromParent<
    TParentRoute["__types"]["context"],
    TRouteContext
  >,
  // TRouterContext extends AnyContext = AnyContext,
  // TChildren = unknown,
  // TRoutesInfo extends DefaultRoutesInfo = DefaultRoutesInfo,
  TViewModel extends IRouteViewModel<TAllParams, TFullSearchSchema> = IRouteViewModel<TAllParams, TFullSearchSchema>,
>(
  vmFactory: () => TViewModel,
  options: RouteOptions<
    TParentRoute,
    TCustomId,
    TPath,
    InferFullSearchSchema<TParentRoute>,
    TSearchSchema,
    TFullSearchSchema,
    TParentRoute["__types"]["allParams"],
    TParams,
    TAllParams,
    TParentContext,
    TAllParentContext,
    TRouteContext,
    TContext
  >
) {
  const customOptions = buildViewModelOptions(vmFactory);
  const newOptions = Object.assign(options, customOptions) as typeof options;
  return new Route(newOptions);
}

export function buildRootRoute<
  TSearchSchema extends AnySearchSchema = {},
  TContext extends RouteContext = RouteContext,
  TRouterContext extends RouterContext = RouterContext,
  TViewModel extends IRouteViewModel<NoParams, TSearchSchema> = IRouteViewModel<NoParams, TSearchSchema>,
>(
  vmFactory: () => TViewModel,
  options: Omit<
    RouteOptions<
      AnyRoute,
      RootRouteId,
      "",
      {},
      TSearchSchema,
      NoInfer<TSearchSchema>,
      {},
      TRouterContext,
      TRouterContext,
      TContext,
      NoInfer<TContext>
    >,
    "path" | "id" | "getParentRoute" | "caseSensitive" | "parseParams" | "stringifyParams"
  >
) {
  const customOptions = buildViewModelOptions(vmFactory);
  const newOptions = Object.assign(options, customOptions) as typeof options;
  return new RootRoute(newOptions);
}

// helpers
type MergeFromParent<T, U> = IsAny<T, U, T & U>;
