# 0.12 + Navigation branch

## @frui.ts/Screens

 - `IHasNavigationName` deleted, `NavigationName` moved to `IScreen`
 - `IHasNavigationParams` deleted, handle the logic directly in `navigate()` instead
 - Added `INavigationParent`
 - Current screens and conductors updated according to the changes above
