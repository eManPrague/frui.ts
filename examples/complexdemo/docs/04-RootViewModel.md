# Root ViewModel

    yarn add mobx mobx-react-lite @frui.ts/screens @frui.ts/views @frui.ts/helpers

Create `viewModels/rootViewModel.ts`:

```ts
import { ScreenBase } from "@frui.ts/screens";

export default class RootViewModel extends ScreenBase {
  name = "Complex demo app";
}
```

We can now display the view model. Note that we are resolving it from the container and there is no explicit view defined.

`app.tsx`

```tsx
import { View } from "@frui.ts/views";
import { Container } from "inversify";
import React from "react";
import ReactDOM from "react-dom";
import RootViewModel from "./viewModels/rootViewModel";

export function runApp(container: Container) {
  const rootViewModel = container.get(RootViewModel);
  ReactDOM.render(<View vm={rootViewModel} useLifecycle />, document.getElementById("root"));
}
```

## View

`views/rootView.tsx`:

```tsx
import { registerView, ViewComponent } from "@frui.ts/views";
import React from "react";
import RootViewModel from "../viewModels/rootViewModel";

const RootView: ViewComponent<RootViewModel> = ({ vm }) => {
  return <p>Hello from {vm.name}!</p>;
};

registerView(RootView, RootViewModel);
```

`ViewComponent` is a simple type shortcut for `React.FunctionComponent<{ vm: TViewModel }>`, so our view is a simple React function component with single prop - `vm`.

The `registerView` function registers `RootView` as the default view for `RootViewModel`. Therefore, general `<View />` component can be used to locate the proper view for a particular view model, and there is no need to explicitly mention `RootView` any more.
We just have to make sure the file is loaded:

`views/index.ts` (this file can be generated along DI configuration files)

```ts
import "./rootView";
```

`index.tsx`

```tsx
import "reflect-metadata";
import { runApp } from "./app";
import createContainer from "./di.config";
import * as serviceWorker from "./serviceWorker";
import "./views"; // <-- add this

const container = createContainer();
runApp(container);
...
```
