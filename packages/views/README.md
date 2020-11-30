# `@frui.ts/views`

# View discovery

In order to support ViewModel-driven workflow, view discovery is an essential feature. This means that based on a particular view model instance, we should be able to find the proper view and display it.

This feature consists of two parts - view registry that is a list of all available view models and their assigned views, and the `View` component that makes the lookup and rendering.

To register a view, use the `registerView(view, viewModelConstructor, context?)` function. If you need to register multiple views for a view model (e.g., main view, side bar, toolbar, etc.), use the `context` argument.

The `View` component accepts the following props:

- `vm` - the actual view model to be displayed
- `context` - optionally provide value to specify a view to use
- `useLifecycle` - if set to `true`, the view will pass lifecycle events (activate, deactivate) to the view model. This is needed only for the top-most root view because all child view models will receive the events from their parent view model.
- `fallbackMode` - by default, the view throws an error when the appropriate view cannot be found. You can set `message` or `empty` to display an error message or empty control instead.

## Usage

```tsx
// loginView.tsx
import { observer } from "mobx-react-lite";
import { registerView } from "@frui.ts/views";

const loginView: React.FunctionComponent<{ vm: LoginViewModel }> = observer(({ vm }) => (
  <TextBox target={vm.credentials} property="login" />
  <TextBox target={vm.credentials} property="password" type="password" />
);

export default registerView(loginView, LoginViewModel);
```

Let's have `RootViewModel` as follows:

```tsx
class RootViewModel extends ConductorSingleChild<LoginViewModel | DataViewModel> {
  ...
}
```

We can display proper views for the currently active child of the `RootViewModel`:

```tsx
// rootView.tsx
...
<aside>
  <View vm={vm.activeChild} context="sidebar" fallbackMode="empty" />
</aside>
<main>
  <View vm={vm.activeChild} />
</main>
```

# BindingComponent

The core component for 2-way binding is `BindingComponent`, a wrapper around any visual component.

When creating a custom bindable control, you can use the following:

- `this.value` - contains the value that the control is bound to, use it in the underlying component
- `this.setValue(value)` - call this and pass the new value when the user changes the value through the underlying component
- `this.inheritedProps` - contains the props passed to the wrapper except for binding-specific properties, so that you can directly pass it to the underlying component

## Example

```tsx
export class TextBox<TTarget> extends BindingComponent<TTarget, IBindingProps<TTarget>> {
  render() {
    return (
      <Observer>
        {() => (
          <input {...this.inheritedProps} type="text" value={this.value || ""} onChange={this.handleValueChanged} />
        )}
      </Observer>
    );
  }

  @bind
  protected handleValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
    this.setValue(e.target.value);
  }
}
```

```jsx
// in view
<TextBox target="{vm.item}" property="firstName" placeholder="First name" />
```

## Binding to properties

Note that you can bind to properties with custom getter and setter. This is useful when the format of bound values needs some conversion between the input control and target object. You just need to mark the getter with a `@computed` decorator (which is not needed for read-only computed getters because Mobx adds it implicitly).
