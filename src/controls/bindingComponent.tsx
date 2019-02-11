import { ensureObservableProperty } from "@src/helpers/observableHelpers";
import { action, decorate, extendObservable, get, isObservable, isObservableProp, observable, set } from "mobx";
import React = require("react");

export interface IBindingProps<TTarget> {
  target?: TTarget;
  property?: keyof TTarget & string;
  onValueChanged?: (value: any, property?: keyof TTarget & string, target?: TTarget) => void;
}

export abstract class BindingComponent<TProps extends IBindingProps<TTarget>, TTarget> extends React.Component<TProps, undefined> {
  protected get inheritedProps() {
    const cloned = Object.assign({}, this.props) as TProps;
    delete cloned.target;
    delete cloned.property;
    delete cloned.onValueChanged;

    return cloned;
  }

  protected get value() {
    const { target, property } = this.props;

    if (!target) {
      throw new Error("'target' prop has not been set");
    }
    if (!property) {
      throw new Error("'property' prop has not been set");
    }

    if (!isObservable(target)) {
      ensureObservableProperty(target, property, target[property]);
    }

    return get(target, property);
  }

  @action
  protected setValue(value: any) {
    const { target, property, onValueChanged } = this.props;

    ensureObservableProperty(target, property, value);

    if (onValueChanged) {
      onValueChanged(value, property, target);
    }
  }
}
