import { observable } from "mobx";
import { Type } from "class-transformer";
import { Expose } from "class-transformer";
import PaymentTypeDto from "./paymentTypeDto";

// This entity has been generated, do not change its content, your changes might get lost. You CAN modify the rest of the file.
export default class EnumerationResponseDto {
  @observable
  @Type(() => PaymentTypeDto)
  @Expose({ name: "payment_types" })
  paymentTypes!: PaymentTypeDto[];

  static ValidationRules = {
    paymentTypes: { required: true },
  };
}
