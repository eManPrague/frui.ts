import { observable, makeObservable } from "mobx";
import { Expose } from "class-transformer";

// This entity has been generated, do not change its content, your changes might get lost. You CAN modify the rest of the file.
export default class PaymentDto {
  /**
   * Category id
   */
  @observable
  @Expose({ name: "category_id" })
  categoryId!: number;

  /**
   * Payment name
   */
  @observable
  name!: string;

  @observable
  @Expose({ name: "paid_at" })
  paidAt!: string;

  @observable
  price!: number;

  static ValidationRules = {
    categoryId: { required: true, number: true },
    name: { required: true },
    paidAt: { required: true },
    price: { required: true, number: true },
  };

  constructor() {
    makeObservable(this);
  }
}
