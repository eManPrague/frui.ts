import { observable } from "mobx";

// This entity has been generated, do not change its content, your changes might get lost. You CAN modify the rest of the file.
export default class PaymentTypeDto {
  id!: number;

  @observable
  name!: string;

  @observable
  coefficient!: number;

  static ValidationRules = {
    name: { required: true },
    coefficient: { required: true, number: true },
  };
}
