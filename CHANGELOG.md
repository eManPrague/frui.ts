# 0.12 + Navigation branch

## @frui.ts/Screens

 - Added `Router`
 - `IHasNavigationName` deleted, `NavigationName` moved to `IScreen`.
 - `IHasNavigationParams` deleted, `get navigationParams()` is now directly in `ScreenBase`. You can handle incoming params in `navigate()` function (move your logic from `applyNavigationParams()`).
 - Added `INavigationParent`.
 - Current screens and conductors updated according to the changes above.
