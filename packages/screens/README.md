# `@frui.ts/screens`

# Screens

Since the application should be **ViewModel-driven**, we need to properly design the application structure within VMs.

There is a simple base class for all view models - `ScreenBase`. It handles basic lifecycle such as `initialize`, `activate`, `deactivate`. These actions origin from the root `View` component and are passed to child view models by their parent conductors.

Hierarchical nesting of VMs is necessary to structure almost any application, and thus base classes for the task are supplied as well:

- `ConductorSingleChild` - conductor with manually managed child VMs, e.g., a list with a detail page.
- `ConductorOneChildActive` - conductor with a list of children and single active child. This is used when the parent has a static list of possible child VMs and only a single child can be active at a time. E.g., application module with list of pages.
- `ConductorAllChildrenActive` - conductor with a list of children of which all are active. This is typical for multi-window screens or dashboards.

We recommend to design the structure of VMs first and only after that start with views implementation.

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
- `findNavigationChild(navigationName)` - implement this function to return proper child view model based on the navigation name provided. It is automatically called when navigating. However, you can reuse it in your logic as well (e.g., when creating a child for `tryActivateChild`).
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

`Busywatcher` is a simple counter of currently running processes that need to display loading progress. You can either manually increment and decrement the counter, get a disposable ticket with `getBusyTicket()`, or use its `watch()` function to watch over a promise.

You can also use function decorator `@watchBusy`. It automates the use of `busyWatcher.watch()` - if the function the decorator is applied to is async or returns a promise, and the parent class also contains a property named `busyWatcher`, the function is automatically watched by the busyWatcher.

```ts
import { BusyWatcher, watchBusy } from "@frui.ts/screens";

class MyViewModel {
  busyWatcher = new BusyWatcher();

  @watchBusy
  async doLongProcess() {
    // busyWatcher.isBusy == true
    await someAction();
    await anotherAction();
  }
}
```

# Navigation

There are several use cases related to navigation:

### 1. Notify that application navigation has changed

Every time the application needs to update the navigation state (usually resulting in changing the URL), it raises an event. In order to streamline the event issuing, there is a helper function on `NavigationConfiguration`.

```ts
import { NavigationConfiguration } from "@frui.ts/screens";

// is you call this from a view model, you will probably replace 'currentScreen' with 'this'
NavigationConfiguration.onScreenChanged?.(currentScreen);
```

There are two places where `onScreenChanged` is called by default:

1. Whenever a `ScreenBase` is activated.
2. When a `ConductorBaseWithActiveChild` does not have an active child.

You might notice that point 1 would cause problems when activating a parent conductor with already present active child (because both get activated). To handle that, there is a property `canBeNavigationActiveScreen` in `ScreenBase`. The property is used as a flag if the actual `onScreenChanged` should be called. For example in `ConductorBaseWithActiveChild`, it is implemented as this:

```ts
get canBeNavigationActiveScreen() {
  return !this.activeChildValue;
}
```

So, if you are creating some kind of a conductor that contains children, you should implement the property similarly.

Besides the automatic URL update when changing active VMs, you might also want to update URL on some actions within a VM (e.g., a filter is changed). For that, you just need to call `notifyNavigationChanged()` that is available from the base class `ScreenBase` whenever you want to update the navigation state.

### 2. Get current navigation path

When a call to `onScreenChanged` is issued, the simplest way to get the actual navigation path is to call `getNavigationPath` on the source view model. It is then its responsibility to get the proper path. The default implementation in `ScreenBase` recursively calls parent view models to get the full path.

### 3. React when URL changes

When the navigation path changes from outside of the application, we need the app to react. Because Frui.ts applications are composed as a hierarchical structure of view models, the navigation should start from the top-most level, i.e., the root view model. Simply call its `navigate()` function. And let it recursively activate its children along the new path.

### 4. Generate local navigation links

When you want to navigate between children of a conductor, you can use `conductor.tryActivateChild(child)`. This will work, properly update browser URL, and also react to any URL changes. However, the action will be bound to the respective user control such as a button via `onClick` handler, and thus some typical web actions such as opening the link in a new window will not work. If you need such functionality, we need to generate a navigation URL for the children.

You can either manually call `child.getNavigationPath()`, use `conductor.getChildNavigationPath()`, or call a helper function `Router.getChildUrlFactory()`. This factory function is usefull especially when creating multiple URLs, because it caches the root path.

```tsx
import { Router } from "@frui.ts/screens";

...
// somewhere inside a view
const getUrl = Router.getChildUrlFactory(vm);

<a href={getUrl("childId")}>Link</a> // creates <a href="#/foo/bar/parent/childId">Link</a>
```

You can also use application-wide links as described below.

### 5. Generate application-wide navigation links

You can also use a navigation path for navigating to another part of the application. The hard part here is how to get the proper path.

The first and obvious solution is to generate it manually. That is quite easy provided that you know the structure of your application and navigation names of the respective view models.

```tsx
<a href={`#/foo/bar/${id}`}>Link</a>
```

```ts
rootViewModel.navigate(`foo/bar/${id}`);
```

You can also use a typical solution with centrally defined routes. What we don't like about this solution is that you still rely on knowing the proper path for each view model, and in case of any change, you have to remember to update the routes as well. We wanted to find a better solution and keep the knowledge about the application structure as close to the source as possible.

The idea is that you always register only a single parent-child relationship. Then, during the application initialization, these parts are joined to get the full path from the root view model to the deepest child view models.

```ts
// rootViewModel.ts
import { ConductorOneChildActive, Router, ScreenBase } from "@frui.ts/screens";

// we already need to reference the child VMs in the constructor,
// so it is OK to mention it here as well
@Router.registerRoute({ route: "", children: [OrdersViewModel, UsersViewModel] })
export default class RootViewModel extends ConductorOneChildActive<ScreenBase> {

  constructor(ordersVM: OrdersViewModel, usersVM: UsersViewModel)
  {
    ...
  }
}
```

```ts
// usersViewModel.ts
import { ConductorOneChildActive, Router, ScreenBase } from "@frui.ts/screens";

@Router.registerRoute({ name: "usersList", route: "users" })
@Router.registerRoute({ name: "userDetail", route: "users/:userId" })
@Router.registerRoute({ name: UserDetailViewModel, route: "users/:userId" }) // you can use a type or a symbol as route name as well
export default class UsersViewModel extends ConductorSingleChild<UserDetailViewModel> {
  navigationName = "users";

  constructor(private ordersModule: OrdersModuleViewModel, securityModule: SecurityModuleViewModel)
  {
    ...
  }
}
```

Please note that if you want to use a class' type as its own route name, this will not work:

```ts
@Router.registerRoute({ name: UsersViewModel, route: "users" }) // throws ReferenceError: Cannot access 'UsersViewModel' before initialization
export default class UsersViewModel extends ConductorSingleChild<UserDetailViewModel> {
  ...
}
```

However, you can use the `Router.Self` helper instead:

```ts
@Router.registerRoute({ name: Router.Self, route: "users" })
export default class UsersViewModel extends ConductorSingleChild<UserDetailViewModel> {
  ...
}
```

```ts
import { Router } from "@frui.ts/screens";

const router = new Router();
router.start(rootViewModel);

...

const url = router.getUrl("userDetail", { userId: 42 }); // "#/users/42"
await router.navigate("userDetail", { userId: 42 }); // immediately navigates to the user detail
await router.navigate(UserDetailViewModel, { userId: 42 }); // use type as route name
```

## Navigation summary

The chain of events when using `router.navigate` for application-wide navigation is as follows:

1.  Router generates target navigation path
2.  The navigation path is passed to `rootViewModel.navigate()` which recursively activates VMs through the VM hierarchy
3.  When the last VM is activated, it notifies that application navigation has changed which eventually updates URL in the browser's navigation bar.

## `HashNavigationAdapter`

This is a reference implementation for a navigation adapter that handles browser URL and history changes through URL hash.

To initialize the adapter, you need to provide the root view model. It will automatically hook to the `onScreenChanged` handler.

```ts
// in your application initialization code
import { HashNavigationAdapter } from "@frui.ts/screens";

...
const urlAdapter = new HashNavigationAdapter();
urlAdapter.start(rootViewModel);
```

Implement `ICanNavigate` if you want to control the navigation path for children and react to changes in the navigation path. Note that the conductors described above already implement `ICanNavigate`.

## `PathNavigationAdapter`

Similar to the HashNavigationAdapter, this adapter controls navigation and history, but using the URL path.

In order to properly handle client routes on the server, please refer to the [Create React App documentation](https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing).

### Links

Since all links generated by Router (e.g., `router.getUrl()`) are just a relative URL links (e.g., `/users/list`), you need to explicitly handle clicks on such links in order to avoid server requests. This is usually done by adding `onClick` event handler.
You can use `hrefParams()` helper function from `@frui.ts/views` to automatically set the `href` attribute as well as the respective `onClick` event handler:

```jsx
import { hrefParams } from "@frui.ts/views";

// instead of:
<a href="/users/list" >Go to users</a>

// use:
<a {...hrefParams("/users/list")} >Click me!</a>
```