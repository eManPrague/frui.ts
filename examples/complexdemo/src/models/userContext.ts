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
