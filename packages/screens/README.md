# `@frui.ts/screens`

Since the application should be ViewModel-driven, we need to properly design the application structure within VMs.

There is a simple base class for all view models - `ScreenBase`. It handles basic lifecycle such as `init`, `activate`, `deactivate`. These actions come from the `View` component.

Hierarchical nesting of VMs is necessary to structure almost any application and thus base classes for the task are supplied as well:

- `ConductorSingleChild` - conductor with manually managed child VMs, e.g., a list with a detail page.
- `ConductorOneChildActive` - conductor with a list of children and single active child. This is used when the parent has a static list of possible child VMs and only a single child can be active at a time. E.g., application module with list of pages.
- `ConductorAllChildrenActive` - conductor with a list of children of which all are active. This is typical for multi window screens or dashboards.

It is recommended to design the structure of VMs first and only after that start with views implementation.

These components are heavily inspired by the Caliburn.Micro framework from .NET platform.

## `ScreenBase`

### Useful functionality

- `navigationName` - name used for navigation path (URL)

- `isActive` - observable property indicating whether the screen is currently active/visible in the application
- `onInitialize()`, `onActivate()`, `onDeactivate()` - override these functions in derived class if you need to react to the respective events. If overriding in conductors, don't forget to call the function from base class (`super`) as well.

- `canDeactivate()` - use this function in views to enable/disable close button. You can override this function and implement custom logic. Conductors override this function and forward it to `canDeactivate()` from their children.
- `requestClose()` - use this function to ask the screen's parent to close the screen.

#### Example

```html
<button disabled="{!vm.canDeactivate()}" onClick="{vm.requestClose}">Close</button>
```

## `ConductorSingleChild`

### Useful functionality

- `activeChild` - observable property with the currently selected child
- `tryActivateChild(child)` - call this function to change the currently selected child. Automatically closes the old child if possible (calls `canDeactivate` on the child) and assigns `parent` to the new one.
- `closeChild(child)` - use to properly close the child (calls `canDeactivate`)
- `findNavigationChild(navigationName)` - implement this function to return proper child view model based on the navigation name provided. It is automatically called when navigating, however, you can reuse it in your logic as well (e.g., when creating a child for `tryActivateChild`).
- `onChildNavigated(child)` - implement this function to do some actions after navigation is done

## `ConductorOneChildActive`

### Useful functionality

- `activeChild` - observable property with the currently selected child
- `children` - add all possible children here. Just adding a child to the list assigns its `parent` property.
- `tryActivateChild(child)` - call this function to switch to another child
- `closeChild(child)` - use to properly close the child (calls `canDeactivate`) and remove it from `children`

## `ConductorAllChildrenActive`

### Useful functionality

- `children` - add all possible children here. Just adding a child to the list assigns its `parent` property.
- `closeChild(child)` - use to properly close the child (calls `canDeactivate`) and remove it from `children`

## Busywatcher

`Busywatcher` is a simple counter of currently running processes that need to display a loading progress. You can either manually increment and decrement the counter, get a disposable ticket with `getBusyTicket()`, or use its `watch()` function to watch over a promise.

You can also use function decorator `@watchBusy`. It automates the use of `busyWatcher.watch()` - if the function the decorator is applied to is async or returns a promise, and the parent class also contains a property named `busyWatcher`, the function is automatically watched by the busyWatcher.

## Navigation

TODO initialize navigation

Implement `IHasNavigationParams` if you want to propagate some parameter no the navigation path.

Implement `ICanNavigate` if you want to control navigation path for children and react to changes in the navigation path. Note that the conductors described above already implement `ICanNavigate`.
