# 0.15.0

- New package @frui.ts/dataviews with higher-order components for displaying data. Check the [readme](./packages/dataviews/README.md).
- React and Mobx made peer dependencies
- `Router` requires root view model on `start()` instead of a constructor
- Route name can be string, symbol, or class
- `UrlNavigationAdapter` requires root view model on `start()` instead of a constructor
- You can provide custom JSON serializer to `FetchApiConnector
- `initialize(): Promise<any> | void` added to `IActivatable` (and therefore to `IScreen` as well)
- `ConductorSingleChild` required `findNavigationChild` to be implemented.
- When activating a child of a conductor, it gets at least initialized when the parent is not active

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
