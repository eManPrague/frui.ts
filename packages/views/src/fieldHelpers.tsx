import type { BindingTarget } from "@frui.ts/helpers";
import React from "react";
import type { IBindingProps } from "./bindingProps";

// either a bindable react component or a function accepting binding props and returning a component should be provided
export interface IComponentInChildrenProps<TTarget extends BindingTarget, TChildProps> {
  children(bidingProps: IBindingProps<TTarget>, childProps: TChildProps): React.ComponentType;
}
export interface IComponentInAttributeProps<TTarget extends BindingTarget> {
  component?: React.ComponentType<IBindingProps<TTarget>>; // TODO why cannot build when this is not optional?
  componentprops?: any;
}

export type IFormFieldProps<TTarget extends BindingTarget, TChildProps> = IBindingProps<TTarget> &
  (IComponentInChildrenProps<TTarget, TChildProps> | IComponentInAttributeProps<TTarget>);

export function extractBindingProps<TTarget extends BindingTarget>(props: IBindingProps<TTarget>): IBindingProps<TTarget> {
  return {
    target: props.target,
    property: props.property,
    onValueChanged: props.onValueChanged,
  };
}

function hasComponentInChildren<TTarget extends BindingTarget, TChildProps>(
  object: any
): object is IComponentInChildrenProps<TTarget, TChildProps> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return !!object?.children && typeof object.children === "function";
}

function hasComponentInAttribute<TTarget extends BindingTarget>(object: any): object is IComponentInAttributeProps<TTarget> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return !!object?.component;
}

export function getInnerComponent<TTarget extends BindingTarget, TChildProps>(
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
