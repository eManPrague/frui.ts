# `@frui.ts/screens`

Since the application should be viewmodel-driven, we need to properly design the application structure within VMs.

There is a simple base class for all view models - `ScreenBase`. It handles basic lifecycle such as `init`, `activate`, `deactivate`. These actions come from the `View` component.

Hierarchical nesting of VMs is necessary to structure almost any application and thus base classes for the task are supplied as well:

- `ConductorSingleChild` - this is usually used when you want to manually create child VMs. E.g., list with possible detail page.
- `ConductorOneChildActive` - conductor with list of children and single active child. This is used when the parent has a static list of possible child VMs and only single child can be active at a time. E.g., application module with list of pages.
- `ConductorAllChildrenActive` - conductor with list of children of which all are active. This is used when the parent has a list child VMs and all children are active. This is typical for multi window screens or dashboards.

It is recommended to design the structure of VMs first and only after that start with views implementation.

These components are heavily inspired by the Caliburn.Micro framework from .NET platform.

## `ScreenBase`

### Useful functionality

- `navigationName` - name used for navigation path (URL)

- `isActive` - observable property indicating whether the screen is currently active/visible in the application
- `onInitialize()`, `onActivate()`, `onDeactivate()` - override these functions in derived class if you need to react to the respective events. If overriding in conductors, don't forget to call the function from base class (`super`) as well.

- `canClose()` - use this function in views to enable/disable close button. You can override this function and implement custom logic. Conductors override this function and forward it to `canClose()` from their children.
- `requestClose()` - use this function to ask the screen's parent to close the screen.

#### Example

```html
<button disabled="{!vm.canClose()}" onClick="{vm.requestClose}">Close</button>
```

## `ConductorSingleChild`

### Useful functionality

- `activeChild` - observable property with the currently selected child
- `activateChild(child)` - call this function to change the currently selected child. Automatically closes the old child if possible (calls `canClose` on the child) and assigns `parent` to the new one.
- `closeChild(child)` - use to properly close the child (calls `canClose`)
- `findNavigationChild(navigationName)` - implement this function to return proper child view model based on the navigation name provided. It is automatically called when navigating, however, you can reuse it in your logic as well (e.g., when creating a child for `activateChild`).
- `onChildNavigated(child)` - implement this function to do some actions after navigation is done

## `ConductorOneChildActive`

### Useful functionality

- `activeChild` - observable property with the currently selected child
- `children` - add all possible children here. Just adding a child to the list assigns its `parent` property.
- `activateChild(child)` - call this function to switch to another child
- `closeChild(child)` - use to properly close the child (calls `canClose`) and remove it from `children`

## `ConductorAllChildrenActive`

### Useful functionality

- `children` - add all possible children here. Just adding a child to the list assigns its `parent` property.
- `closeChild(child)` - use to properly close the child (calls `canClose`) and remove it from `children`

## Busywatcher

`Busywatcher` is a simple counter of currently running processes that need to display a loading progress. You can either manually increment and decrement the counter, get a disposable ticket with `getBusyTicket()`, or use its `watch()` function to watch over a promise.

You can also use function decorator `@watchBusy`. It automates the use of `busyWatcher.watch()` - if the function the decorator is applied to is async or returns a promise, and the parent class also contains a property named `busyWatcher`, the function is automatically watched by the busyWatcher.
