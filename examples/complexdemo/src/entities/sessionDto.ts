import { observable, makeObservable } from "mobx";

// This entity has been generated, do not change its content, your changes might get lost. You CAN modify the rest of the file.
export default class SessionDto {
  @observable
  email!: string;

  @observable
  password!: string;

  static ValidationRules = {
    email: { required: true },
    password: { required: true },
  };

  constructor() {
    makeObservable(this);
  }
}
