import { observable, makeObservable } from "mobx";
import { Type } from "class-transformer";
import { Expose } from "class-transformer";

// This entity has been generated, do not change its content, your changes might get lost. You CAN modify the rest of the file.
export default class Category {
  /**
   * Internal ID
   */
  id!: number;

  /**
   * Category name
   */
  @observable
  name!: string;

  /**
   * Description
   */
  @observable
  desc!: string;

  /**
   * Debit / Credit
   */
  @observable
  type!: number;

  /**
   * User reference
   */
  @observable
  @Expose({ name: "user_id" })
  userId!: number;

  @observable
  @Type(() => Date)
  @Expose({ name: "created_at" })
  createdAt!: Date;

  @observable
  @Type(() => Date)
  @Expose({ name: "updated_at" })
  updatedAt!: Date;

  static ValidationRules = {
    name: { required: true },
    desc: { required: true },
    type: { required: true, number: true },
    userId: { required: true, number: true },
    createdAt: { format: "date-time", required: true, date: true },
    updatedAt: { format: "date-time", required: true, date: true },
  };

  constructor() {
    makeObservable(this);
  }
}
