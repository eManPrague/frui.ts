import { bound } from "@frui.ts/helpers";
import { ScreenBase } from "@frui.ts/screens";
import { observable } from "mobx";
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

  @bound async login() {
    if (!this.credentials.userName || !this.credentials.password) {
      return;
    }

    await this.authorization.login(this.credentials.userName, this.credentials.password, this.persistLogin);
  }
}
