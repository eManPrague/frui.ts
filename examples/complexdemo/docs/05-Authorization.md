# Authorization

Our authorization logic will be composed of several components:

- `AuthorizationService` - core logic for user authorization
- `UserContext` - contains information about the current user, provides tokens for API calls
- `LoginViewModel` - handles user interaction regarding the login process
- `LoginRepository` - communicates with the authorization server

## UserContext

This simple model holds information whether the current user is looged in and also contains authorizaton token for API access.

`models/userContext.ts`

```ts
import { action, observable } from "mobx";
import CurrentUser from "./currentUser";
export default class UserContext {
  @observable private _user?: CurrentUser;
  get user() {
    return this._user;
  }

  @observable private _apiToken?: string;
  get apiToken() {
    return this._apiToken;
  }

  get isAuthorized() {
    return !!this._apiToken;
  }

  @action setUser(user: CurrentUser, apiToken: string) {
    this._user = user;
    this._apiToken = apiToken;
  }

  @action logout() {
    this._user = undefined;
    this._apiToken = undefined;
  }
}
```

## LoginRepository

Connects to the external authentication service and validates user credentials.

`data/reposiories/loginRepository.ts`

```ts
export default class LoginRepository {
  async login(userName: string, password: string) {
    // TODO make actual backend call to authorize the user
    return {
      email: userName,
      firstName: "John",
      lastName: "Johnattan",
      apiKey: "ABC123",
    };
  }
}
```

## AuthorizationService

Let's put all authorization related logic here:

`services/authorizationService.ts`

```ts
import LoginRepository from "../data/repositories/loginRepository";
import CurrentUser from "../models/currentUser";
import UserContext from "../models/userContext";

export default class AuthorizationService {
  constructor(private userContext: UserContext, private repository: LoginRepository) {}

  async login(userName: string, password: string, persistLogin: boolean) {
    const user = await this.repository.login(userName, password);

    if (user) {
      const userModel = new CurrentUser(user.email, user.firstName, user.lastName);
      this.userContext.setUser(userModel, user.apiKey);
      return true;
    } else {
      return false;
    }
  }

  async tryPersistedLogin() {
    // TODO try to refresh the persisted login credentials and return whether the user is logged in
    return false;
  }
}
```

## LoginViewModel

We need to create the view model that will display UI and make proper service calls.

`models/loginModel.ts`

```ts
import { observable } from "mobx";

export default class LoginModel {
  @observable userName?: string;
  @observable password?: string;
}
```

`viewModels/loginViewModel.ts`

```ts
import { ScreenBase } from "@frui.ts/screens";
import { observable } from "@frui.ts/screens/node_modules/mobx";
import LoginModel from "../models/loginModel";
import AuthorizationService from "../services/authorizationService";

export default class LoginViewModel extends ScreenBase {
  credentials = new LoginModel();
  @observable persistLogin = false;

  constructor(private authorization: AuthorizationService) {
    super();
  }

  get canLogin() {
    return !!this.credentials.userName && !!this.credentials.password;
  }

  async login() {
    if (!this.credentials.userName || !this.credentials.password) {
      return;
    }

    await this.authorization.login(this.credentials.userName, this.credentials.password, this.persistLogin);
  }
}
```

We will use [React bootstrap](https://react-bootstrap.github.io/) for the UI. Install the required packages:

    yarn add @frui.ts/bootstrap react-bootstrap

`views/loginView.tsx`

```tsx
import { Check, Input } from "@frui.ts/bootstrap";
import { registerView, ViewComponent } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button } from "react-bootstrap";
import LoginViewModel from "../viewModels/loginViewModel";

const LoginView: ViewComponent<LoginViewModel> = observer(({ vm }) => (
  <section>
    <Input placeholder="User name" target={vm.credentials} property="userName" />
    <Input placeholder="Password" target={vm.credentials} property="password" type="password" />
    <label>
      <Check target={vm} property="persistLogin" />
      Remember me
    </label>

    <Button disabled={!vm.canLogin} onClick={vm.login}>
      Login
    </Button>
  </section>
));
registerView(LoginView, LoginViewModel);
```

Note that we need to use `observer` function because the view should update as `vm.canLogin` changes.

## Login workflow

Our main app workflow is quite simple - display LoginViewModel until the user is authenticated. Let's translate it to the code located in `app.tsx`:

```tsx
function renderRoot(container: Container, isUserAuthorized: boolean) {
  const viewModel: ScreenBase = isUserAuthorized ? container.get(RootViewModel) : container.get(LoginViewModel);
  ReactDOM.render(<View vm={viewModel} useLifecycle />, document.getElementById("root"));
}

export function runApp(container: Container) {
  const userContext = container.get(UserContext);

  // since userContext.isAuthorized is MobX observable, we need to react to its changes
  reaction(
    () => [userContext.isAuthorized],
    ([isAuthorized]) => renderRoot(container, isAuthorized),
    { fireImmediately: true }
  );
}
```

In order to make `UserContext` resolvable from the container, we need to register its instance in `di.config.ts`. `LoginRepository` shall be registered by the generated code in `di.registry.ts`.

```ts
export default function createContainer() {
  const container = new Container({ skipBaseClassChecks: true });

  const userContext = new UserContext();
  container.bind(UserContext).toConstantValue(userContext);

  registerServices(container);

  return container;
}
```
