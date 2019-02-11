import { ensureObservableProperty } from "@src/helpers/observableHelpers";
import { computed, extendObservable, get, observable } from "mobx";
import { IEntityValidator, IPropertyValidationDescriptor } from "./types";

export default class MobxEntityValidator implements IEntityValidator {
  @observable public errorsVisible = false;
  public errors: { [propertyName: string]: string } = {};

  private validatedProperties: string[] = [];

  constructor(target: any, propertyDescriptors: IPropertyValidationDescriptor[], displayValidationErrors: boolean) {
    this.errorsVisible = displayValidationErrors;

    // tslint:disable-next-line: prefer-for-of // optimization
    for (let i = 0; i < propertyDescriptors.length; i++) {
      const { validator, propertyName } = propertyDescriptors[i];
      if (!validator) {
        continue;
      }

      ensureObservableProperty(target, propertyName, target[propertyName] || null);
      this.validatedProperties.push(propertyName);

      extendObservable(this.errors, {
        get [propertyName]() { return validator(get(target, propertyName), target); },
      });
    }
  }

  @computed get isValid() {
    return this.validatedProperties.every(prop => !get(this.errors, prop));
  }
}
