# `bootstrap`

Bootstrap controls ready for Frui.ts integration. Mainly input controls wrapped in `BindingComponent`.

## Input

```
TODO
```

## Select

- `items` - list of available values.
- `keyProperty` - name of the property in `items` that contain item's key. Default is `"id"`.
- `textProperty` - name of the property in `items` that contain item's label displayed in the dropdown control. Default is `"label"`.
- `mode` - specify if only the key or the whole selected entity should be set to the bound property. Default is `"item"`.
- `allowEmpty` - displays an empty item with `undefined` value.
- `isNumeric` - when in the `key` mode, keys are by default `string`. If you want to use numbers only, you need to enable this prop.

```
TODO
```

## Check

You can use all props as in [React Boostrap Check](https://react-bootstrap.github.io/components/forms/#forms-form-check), especially:

- `type` - specify type of the control: `"check" | "radio" | "switch"`
- `id` - unique identifier used to bind label with the actual `<input>` control

Moreover, the are the follofing additional props:

- `threeState` - if set to `true`, the control displays `indeterminate` state if the bound value is `null`
- `value` - this value is set to the bound property when the check is selected. Default set to `true` so that checkboxes by default.

```
TODO
```
