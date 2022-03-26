import { observable } from "mobx";

// This entity has been generated, do not change its content, your changes might get lost. You CAN modify the rest of the file.
export default class CategoryControllerListQuery {
  @observable
  limit!: number;

  @observable
  offset!: number;

  static ValidationRules = {
    limit: { required: true, number: true },
    offset: { required: true, number: true },
  };
}
