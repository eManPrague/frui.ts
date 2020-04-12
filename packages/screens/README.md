# `@frui.ts/screens`

# Screens

Since the application should be **ViewModel-driven**, we need to properly design the application structure within VMs.

There is a simple base class for all view models - `ScreenBase`. It handles basic lifecycle such as `initialize`, `activate`, `deactivate`. These actions origin from the root `View` component and are passed to child view models by their parent conductors.

Hierarchical nesting of VMs is necessary to structure almost any application and thus base classes for the task are supplied as well:

- `ConductorSingleChild` - conductor with manually managed child VMs, e.g., a list with a detail page.
- `ConductorOneChildActive` - conductor with a list of children and single active child. This is used when the parent has a static list of possible child VMs and only a single child can be active at a time. E.g., application module with list of pages.
- `ConductorAllChildrenActive` - conductor with a list of children of which all are active. This is typical for multi window screens or dashboards.

It is recommended to design the structure of VMs first and only after that start with views implementation.

These components are heavily inspired by the Caliburn.Micro framework from .NET platform.

![Interfaces cheatsheet](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/eManPrague/frui.ts/develop/packages/screens/interfaces.puml)

![Classes hierarchy](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/eManPrague/frui.ts/develop/packages/screens/classes.puml)

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

# Busywatcher

`Busywatcher` is a simple counter of currently running processes that need to display a loading progress. You can either manually increment and decrement the counter, get a disposable ticket with `getBusyTicket()`, or use its `watch()` function to watch over a promise.

You can also use function decorator `@watchBusy`. It automates the use of `busyWatcher.watch()` - if the function the decorator is applied to is async or returns a promise, and the parent class also contains a property named `busyWatcher`, the function is automatically watched by the busyWatcher.

# Navigation

There are several use cases related to navigation:

## 1. Notify that application navigation has changed

Every time the application needs to update the navigation state (usually resulting in changing the URL), it raises an event. In order to streamline the event issuing, there is a helper function on `NavigationConfiguration`.

```ts
import { NavigationConfiguration } from "@frui.ts/screens";

// is you call this from a view model, you will probably replace 'currentScreen' with 'this'
NavigationConfiguration.onScreenChanged?.(currentScreen);
```

There are two places where `onScreenChanged` is called by default:

1. Whenever a `ScreenBase` is activated.
2. When a `ConductorBaseWithActiveChild` does not have an active child.

You might notice that point 1 would cause problems when activating a parent conductor with already present active child (because both get activated). To handle that, there is a property `canBeNavigationActiveScreen` and function `notifyNavigationChanged()` in `ScreenBase`. The property is used as a flag if the actual `onScreenChanged` should be called. For example in `ConductorBaseWithActiveChild`, it is implemented as this:

```ts
get canBeNavigationActiveScreen() {
  return !this.activeChildValue;
}
```

So, if you are creating some kind of a conductor that contains children, you should implement the property similarly. Besides that, all you need to do is to call `notifyNavigationChanged()` that is available from the base class `ScreenBase` any time you want to update the navigation state (e.g., a filter is changed).

## 2. Get current navigation path

When a call to `onScreenChanged` is issued, the simplest way to get actual navigation path is to call `getNavigationPath` on the source view model. It is then its responsibility to get the proper path. The default implementation in `ScreenBase` recursively calls parent view models to get the full path.

## 3. React when URL changes

When the navigation path changes from outsite of the application, we need the app to react. Because Frui.ts applications are composed as a hierarchical structure of view models, the navigation should start from the top-most level, i.e., the root view model. Simply call its `navigate()` function. And let it recursively activate its children along the new path.

## 4. Generate local navigation links



## 5. Generate application-wide navigation links



## `UrlNavigationAdapter`

This is a reference implementation for navigation adapter that handles browser URL and history changes.

To initialize the adapter, you need to provide the root view model. It will automatically hook to the `onScreenChanged` handler.

```ts
// in your application initialization code
import { UrlNavigationAdapter } from "@frui.ts/screens";

...
const urlAdapter = new UrlNavigationAdapter(rootViewModel);
urlAdapter.start();
```


Implement `ICanNavigate` if you want to control navigation path for children and react to changes in the navigation path. Note that the conductors described above already implement `ICanNavigate`.
