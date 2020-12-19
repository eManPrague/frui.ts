import { BindingProperty, BindingTarget, isSet } from "@frui.ts/helpers";
import { getValue, IBindingProps, omitBindingProps } from "@frui.ts/views";
import { action, isArrayLike } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { Form, FormCheckProps } from "react-bootstrap";
import { CommonInputProps } from "./commonInputProps";

type SetOrArrayInnerType<TTarget, TProperty extends keyof TTarget> = TTarget[TProperty] extends Set<infer TSetValue> | undefined
  ? TSetValue
  : TTarget[TProperty] extends Array<infer TArrayValue> | undefined
  ? TArrayValue
  : never;

export interface CollectionCheckProps<TTarget extends BindingTarget, TProperty extends BindingProperty<TTarget>>
  extends Omit<FormCheckProps, "property">,
    CommonInputProps,
    IBindingProps<TTarget, TProperty> {
  value: TProperty extends keyof TTarget ? SetOrArrayInnerType<TTarget, TProperty> : any;
}

function useCollection<TTarget extends BindingTarget, TProperty extends BindingProperty<TTarget>>(
  props: CollectionCheckProps<TTarget, TProperty>
): [boolean, () => void] {
  const collection = getValue(props.target, props.property) as unknown;

  if (!collection) {
    throw new Error("The target value must be an array or a Set");
  }

  const key = props.value;

  if (isSet(collection)) {
    const checked = collection.has(key);
    const toggle = () => (collection.has(key) ? collection.delete(key) : collection.add(key));
    return [checked, action(toggle)];
  } else if (isArrayLike(collection)) {
    const checked = collection.includes(key);
    const toggle = () => {
      const index = collection.indexOf(key);
      if (index >= 0) {
        collection.splice(index, 1);
      } else {
        collection.push(key);
      }
    };
    return [checked, action(toggle)];
  } else {
    throw new Error("Target value must be either a Set or an Array");
  }
}

function collectionCheck<TTarget extends BindingTarget, TProperty extends BindingProperty<TTarget>>(
  props: CollectionCheckProps<TTarget, TProperty>
) {
  const [checked, toggle] = useCollection(props);

  const { value, ...otherProps } = omitBindingProps(props);
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const id = `${value}`;

  return <Form.Check id={id} {...otherProps} checked={checked} onChange={toggle} />;
}

export const CollectionCheck = observer(collectionCheck as any) as typeof collectionCheck;
