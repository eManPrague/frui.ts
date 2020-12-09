# 0.16.0

- Added `ManualPromise`, `groupBy()` to @frui.ts/helpers.
- Added `hideValidationErrors()` to @frui.ts/validation.
- Added `ResponsiveTable` and `DataList` controls to @frui.ts/dataviews.
- OpenAPI generator refactored. Supports `allOf` and `oneOf` features.
- OpenAPI generator supports Date conversion with date-fns. Use `dates: "date-fns"` in the config file.

- `Input` in @frui.ts/bootstrap supports new props: `as` and `rows`.
- `Select` in @frui.ts/bootstrap supports new props: `emptyText`.

- `ScreenBase.isInitialized` is now public.
- Added `ContinuousListViewModel` to @frui.ts/datascreens. It covers the case of 'endless' lists.
- `FilteredListViewModel` in @frui.ts/datascreens has new extension/customization points: `cloneFilterForApply()` and `createFilter()`.

- BREAKING: Props of `<View />` changed: `fallbackMode: "message" | "children"`. In case `"children"` is set, the children props of the `<View />` component is rendered when no view is found. You can use `"children"` instead of the original `"empty"`.
- BREAKING: `getValue` and `setValue` hooks accept `target` and `property` arguments instead of a single `props`.
- Binding types changed. You can use the third type parameter of `IBindingProps<TTarget, TProperty, TValue>` to restrict the binding target value type.

- `IApiConnector` and `FetchApiConnector` changes:
  - `fetchFunction`, `jsonSerializer`, and `middleware` properties are now protected and thus available to inheriting classes
  - BREAKING: `postText`, `postFormData` replaced by `post`. The same goest for `putText`, `putFormData`, `patchText`, `patchFormData`, `deleteText`, and `deleteJson`.
  - BREAKING: `delete` now contains `body` argument.
- `RestRequestBuilder` changes:
  - BREAKING: `postFormData` replaced by `postData`, `putFormData` replaced by `putData`
  - added `path(path: string)` for fluent URL building
  - added `url:string` property for reading current URL
  - uses `query-string` package for creating query strings (you can use the `queryStringOptions` property to customize the stringification process - see https://github.com/sindresorhus/query-string#stringifyobject-options)

# 0.15.0

- New package @frui.ts/dataviews with higher-order components for displaying data. Check the [readme](./packages/dataviews/README.md).
- Added `useBinding`, `getValue`, and `setValue` helper functions to @frui.ts/views. You can use them when implementing functional binding components.
- React and Mobx made peer dependencies
- `Router` requires root view model on `start()` instead of the constructor
- `Router` accepts a navigation adapter on `start()`, which enables proper cooperation of the two components
- Route name can be string, symbol, or class
- `UrlNavigationAdapter` requires root view model on `start()` instead of the constructor
- You can provide custom JSON serializer to `FetchApiConnector`
- `initialize(): Promise<any> | void` added to `IActivatable` (and therefore to `IScreen` as well)
- `ConductorSingleChild` requires `findNavigationChild` to be implemented. You can return `undefined`, which was the original default, if you don't need navigation to child screens.
- When activating a child of a conductor, it gets at least initialized when the parent is not active
- `AutomaticDirtyWatcher` can be configured to exclude specified properties
- `Check` in @frui.ts/bootstrap supports indeterminate state. Enable it by setting the `threeState` prop. The state id displayed when the bound value is `null`.
- `Check` in @frui.ts/bootstrap supports `value` property so that it can set custom values to the bound property (not only `boolean`).

# 0.14.1

- OpenApi generator writes string enums as type aliases.
- OpenApi generator supports named arrays as entities.
- Inversify generator supports custom identifiers and auto factories.

# 0.14.0

## @frui.ts/cra-template

- Added a Create React App template.

## @frui.ts/Screens

- Added `Router`.
- `IHasNavigationName` deleted, `NavigationName` moved to `IScreen`.
- `IHasNavigationParams` deleted, `get navigationParams()` is now directly in `ScreenBase`. You can handle incoming params in `navigate()` function (move your logic from `applyNavigationParams()`).
- Added `INavigationParent`.
- Current screens and conductors updated according to the changes above.

## @frui.ts/Views

- Ordering of the generic parameters of `BindingComponent` changed to conform with other components: `BindingComponent<TProps, TTarget>` changed to `BindingComponent<TTarget, TProps>`.

# 0.13.0

- New package @frui.ts/generator with CLI code generator. Check the [readme](./packages/generator/README.md).
