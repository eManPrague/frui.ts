# `@frui.ts/screens`

Since the application should be viewmodel-driven, we need to properly design the application structure within VMs.

There is a simple base class for all view models - `ScreenBase`. It handles basic lifecycle such as `init`, `activate`, `deactivate`. These actions come from the `View` component.

Hierarchical nesting of VMs is necessary to structure almost any application and thus base classes for the task are supplied as well:

 - `ConductorSingleChild` - this is usually used when you want to manually create child VMs. E.g., list with possible detail page.
 - `ConductorOneChildActive` - conductor with list of children and single active child. This is used when the parent has a static list of possible child VMs and only single child can be active at a time. E.g., application module with list of pages.
 - `ConductorAllChildrenActive` - conductor with list of children of which all are active. This is used when the parent has a list child VMs and all children are active. This is typical for multi window screens or dashboards.

It is recommended to design the structure of VMs first and only after that start with views implementation.

These components are heavily inspired by the Caliburn.Micro framework from .NET platform.

## Helpers

`Busywatcher` is a simple counter of currently running processes that need to display a loading progress. You can either manually increment and decrement the counter, get a disposable ticket with `getBusyTicket()`, or use its `watch()` function to watch over a promise.

You can also use function decorator `@watchBusy`. It automates the use of `busyWatcher.watch()` - if the function the decorator is applied to is async or returns a promise, and the parent class also contains a property named `busyWatcher`, the function is automatically watched by the busyWatcher.

## TODO navigation

## Usage

```
// TODO: DEMONSTRATE API
```
