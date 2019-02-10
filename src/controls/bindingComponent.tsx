import { action, get, set } from "mobx";
import React = require("react");

export interface IBindingProps<TTarget> {
  target?: TTarget;
  property?: keyof TTarget & string;
  onValueChanged?: (value: any) => void;
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

    return get(target, property);
  }

  @action
  protected setValue(value: any) {
    const { target, property, onValueChanged } = this.props;

    set(target, property, value);

    if (onValueChanged) {
      onValueChanged(value);
    }
  }
}
