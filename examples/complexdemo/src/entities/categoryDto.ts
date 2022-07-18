import { observable, makeObservable } from "mobx";

// This entity has been generated, do not change its content, your changes might get lost. You CAN modify the rest of the file.
export default class CategoryDto {
  /**
   * Value from ENUM - Category type
   */
  @observable
  type!: number;

  @observable
  name!: string;

  @observable
  desc!: string;

  static ValidationRules = {
    type: { required: true, number: true },
    name: { required: true },
    desc: { required: true },
  };

  constructor() {
    makeObservable(this);
  }
}
