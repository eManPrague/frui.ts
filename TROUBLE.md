# Troubleshooting

## Class-transformer with MobX

Since observable arrays in MobX v4 do not support `Array.isArray`, serializing an observable entity with an array inside using class-transformer does not work. Prefered solution is to use MobX v6, however, until it is fully implemented in Frui.ts, there is a simple monkey patch:

```tsx
// put this into the root index.ts
// import {isObservableArray } from "mobx";
const originalIsArray = Array.isArray;
Array.isArray = function (arg: any): arg is any[] {
  return originalIsArray(arg) || isObservableArray(arg);
};
```

## Child VM is not displayed

Check that you have a `<View>` control that should actually display the child. This control should be probably located in the parent VM's view.

## There is an error saying something about "binding" or "inject"

Make sure that you have regenerated the DI-related code (`yarn generate`).

## Weird build error: /@types/react/index.d.ts:3140:13 - error TS2717: Subsequent property declarations must have the same type.  Property 'view' must be of type 'SVGProps<SVGViewElement>', but here has type 'SVGProps<SVGViewElement>'...

 - There is probably a mismatch between versions of `@types` packages (`@types/react` in the example).
 - If there is a `node_modules` folder up in the folders hierarchy, make sure that the same version of the respective package is installed in all parent node_modules.
 - Check `yarn.lock` for multiple versions of the package (look for `@types/react@` text). You will need to unify the referenced versions either manually, or you can try `npx yarn-deduplicate yarn.lock`


