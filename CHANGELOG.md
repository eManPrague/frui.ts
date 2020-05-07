# 0.14.0

## @frui.ts/Screens

 - Added `Router`
 - `IHasNavigationName` deleted, `NavigationName` moved to `IScreen`.
 - `IHasNavigationParams` deleted, `get navigationParams()` is now directly in `ScreenBase`. You can handle incoming params in `navigate()` function (move your logic from `applyNavigationParams()`).
 - Added `INavigationParent`.
 - Current screens and conductors updated according to the changes above.

# 0.13.0

 - New package @frui.ts/generator with CLI code generator. Check the [readme](./packages/generator/README.md).

