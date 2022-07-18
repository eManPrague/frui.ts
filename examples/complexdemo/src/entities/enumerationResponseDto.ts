import { Expose, Type } from "class-transformer";
import { makeObservable, observable } from "mobx";
import PaymentTypeDto from "./paymentTypeDto";

// This entity has been generated, do not change its content, your changes might get lost. You CAN modify the rest of the file.
export default class EnumerationResponseDto {
  @observable
  @Type(() => PaymentTypeDto)
  @Expose({ name: "payment_types" })
  paymentTypes!: PaymentTypeDto[];

  constructor() {
    makeObservable(this);
  }

  static ValidationRules = {
    paymentTypes: { required: true },
  };
}
