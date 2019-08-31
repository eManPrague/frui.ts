import * as React from "react";
import { IBindingProps } from "./bindingComponent";

// either a bindable react component or a function accepting binding props and returning a component should be provided
export interface IComponentInChildrenProps<TTarget, TChildProps> {
  children(bidingProps: IBindingProps<TTarget>, childProps: TChildProps): React.ComponentType;
}
export interface IComponentInAttributeProps<TTarget> {
  component?: React.ComponentType<IBindingProps<TTarget>>; // TODO why cannot build when this is not optional?
  componentprops?: any;
}

export type IFormFieldProps<TTarget, TChildProps> = IBindingProps<TTarget> &
  (IComponentInChildrenProps<TTarget, TChildProps> | IComponentInAttributeProps<TTarget>);

export function getInnerComponent<TTarget, TChildProps>(
  props: IFormFieldProps<TTarget, TChildProps>,
  childProps: TChildProps
) {
  const bindingProps = extractBindingProps<TTarget>(props);

  if (hasComponentInAttribute<TTarget>(props)) {
    const Component = props.component as React.ComponentType;
    return <Component {...props.componentprops} {...childProps} {...bindingProps} />;
  } else if (hasComponentInChildren<TTarget, TChildProps>(props)) {
    // TODO why the check (and function hasComponentInChildren) is needed here?
    return props.children(bindingProps, childProps);
  }
}

export function extractBindingProps<TTarget>(props: IBindingProps<TTarget>): IBindingProps<TTarget> {
  return {
    target: props.target,
    property: props.property,
    onValueChanged: props.onValueChanged,
  };
}

function hasComponentInChildren<TTarget, TChildProps>(
  object: any
): object is IComponentInChildrenProps<TTarget, TChildProps> {
  return !!object.children && typeof object.children === "function";
}
function hasComponentInAttribute<TTarget>(object: any): object is IComponentInAttributeProps<TTarget> {
  return !!object.component;
}
