import { Check, Input } from "@frui.ts/bootstrap";
import { preventDefault, registerView, ViewComponent } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Form } from "react-bootstrap";
import LoginViewModel from "../viewModels/loginViewModel";
import "./loginView.scss";

const LoginView: ViewComponent<LoginViewModel> = observer(({ vm }) => (
  <div className="wrapper-login">
    <Form className="form-login" onSubmit={preventDefault(vm.login)}>
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

          <Button disabled={!vm.canLogin} type="submit">
            Login
          </Button>
        </fieldset>
      </div>
    </Form>
  </div>
));

registerView(LoginView, LoginViewModel);
