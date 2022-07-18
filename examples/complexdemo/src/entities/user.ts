import { observable, makeObservable } from "mobx";
import { Type } from "class-transformer";

// This entity has been generated, do not change its content, your changes might get lost. You CAN modify the rest of the file.
export default class User {
  /**
   * id
   */
  id!: number;

  @observable
  email!: string;

  @observable
  @Type(() => Date)
  createdAt!: Date;

  @observable
  @Type(() => Date)
  updatedAt!: Date;

  /**
   * Role
   */
  @observable
  role!: number;

  static ValidationRules = {
    email: { required: true },
    createdAt: { format: "date-time", required: true, date: true },
    updatedAt: { format: "date-time", required: true, date: true },
    role: { required: true, number: true },
  };

  constructor() {
    makeObservable(this);
  }
}
