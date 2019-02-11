import { action, computed, get, observable, remove, set } from "mobx";
import { IManualEntityValidator, ValidationErrors } from "./types";

/** Entity validator implementation acting as a simple validation errors list that needs to be manually maintained */
export default class ManualEntityValidator<TTarget> implements IManualEntityValidator<TTarget> {
  @observable public errorsVisible: boolean;
  @observable public errors: ValidationErrors<TTarget> = {};

  constructor(target: TTarget, errorsVisible: boolean) {
    this.errorsVisible = errorsVisible;
  }

  @action
  public clearErrors() {
    Object.keys(this.errors).forEach(prop => remove(this.errors, prop));
  }

  @action
  public addError(propertyName: string & keyof TTarget, message: string) {
    set(this.errors, propertyName, message);
  }

  @action
  public removeError(propertyName: string & keyof TTarget) {
    remove(this.errors, propertyName);
  }

  @computed get isValid() {
    return Object.keys(this.errors).every(prop => !get(this.errors, prop));
  }
}
