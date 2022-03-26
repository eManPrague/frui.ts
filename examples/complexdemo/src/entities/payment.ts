import { observable } from "mobx";
import { Type } from "class-transformer";
import { Expose } from "class-transformer";

// This entity has been generated, do not change its content, your changes might get lost. You CAN modify the rest of the file.
export default class Payment {
  /**
   * Internal ID
   */
  id!: number;

  /**
   * Payment name
   */
  @observable
  name!: string;

  /**
   * Payment date
   */
  @observable
  @Type(() => Date)
  @Expose({ name: "paid_at" })
  paidAt!: Date;

  /**
   * Price
   */
  @observable
  price!: number;

  /**
   * User reference
   */
  @observable
  @Expose({ name: "user_id" })
  userId!: number;

  /**
   * Category reference
   */
  @observable
  @Expose({ name: "category_id" })
  categoryId!: number;

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
    paidAt: { format: "date-time", required: true, date: true },
    price: { required: true, number: true },
    userId: { required: true, number: true },
    categoryId: { required: true, number: true },
    createdAt: { format: "date-time", required: true, date: true },
    updatedAt: { format: "date-time", required: true, date: true },
  };
}
