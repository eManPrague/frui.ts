# Style

Let's add some styling to our app.

    yarn add node-sass bootstrap

`assets/themes/deafult.theme.scss`

```scss
@import "~bootstrap/scss/bootstrap.scss";
```

Add link to the style in `index.tsx`:

```tsx
import "./assets/themes/default.theme.scss";
```

## Login view

Update `loginView.tsx` as follows:

```tsx
import { Check, Input } from "@frui.ts/bootstrap";
import { registerView, ViewComponent } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Form } from "react-bootstrap";
import LoginViewModel from "../viewModels/loginViewModel";
import "./loginView.scss";

const LoginView: ViewComponent<LoginViewModel> = observer(({ vm }) => (
  <div className="wrapper-login">
    <Form className="form-login">
      <div className="card">
        <fieldset className="card-body">
          <Form.Group controlId="userName">
            <Form.Label>User name</Form.Label>
            <Input target={vm.credentials} property="userName" />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Input target={vm.credentials} property="password" type="password" />
          </Form.Group>

          <Form.Group controlId="persistLogin">
            <Check custom target={vm} property="persistLogin" label="Remember me" />
          </Form.Group>

          <Button disabled={!vm.canLogin} onClick={vm.login}>
            Login
          </Button>
        </fieldset>
      </div>
    </Form>
  </div>
));
```

You will also need to add a style file `views/loginView.scss`:

```scss
.wrapper-login {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 3em 0;
}

.form-login {
  width: 100%;
  max-width: 25em;
  padding: 1em;
  margin: auto;
}
```

## Form submit on Enter

The login view now looks much better, however, there is another UX feature we should add - allow the user to hit enter after entering the credentials. We just need to attach the `login` action to the `<Form>` element, instead of the button:

```tsx
import { preventDefault, registerView, ViewComponent } from "@frui.ts/views";
```

Add the handler here. Note that we must prevent the default event, otherwise the page would reload.

```tsx
<Form className="form-login" onSubmit={preventDefault(vm.login)}>
```

Remove the handler and set the type to `submit`

```tsx
<Button disabled={!vm.canLogin} type="submit">
  Login
</Button>
```
