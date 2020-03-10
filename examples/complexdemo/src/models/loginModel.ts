import { observable } from "mobx";

export default class LoginModel {
  @observable userName?: string;
  @observable password?: string;
}
