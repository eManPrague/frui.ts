import { BindingProperty, isSet } from "@frui.ts/helpers";
import { getValue, IBindingProps, omitBindingProps } from "@frui.ts/views";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { Form, FormCheckProps } from "react-bootstrap";
import { CommonInputProps } from "./commonInputProps";

type SetOrArrayInnerType<TTarget, TProperty extends keyof TTarget> = TTarget[TProperty] extends Set<infer TSetValue> | undefined
  ? TSetValue
  : TTarget[TProperty] extends Array<infer TArrayValue> | undefined
  ? TArrayValue
  : never;

export interface CollectionCheckProps<TTarget, TProperty extends BindingProperty<TTarget>>
  extends FormCheckProps,
    CommonInputProps,
    IBindingProps<TTarget, TProperty> {
  value: TProperty extends keyof TTarget ? SetOrArrayInnerType<TTarget, TProperty> : any;
}

function useCollection<TTarget, TProperty extends BindingProperty<TTarget>>(
  props: CollectionCheckProps<TTarget, TProperty>
): [boolean, () => void] {
  const collection = getValue(props.target, props.property);

  if (!collection) {
    throw new Error("The target value must be an array or a Set");
  }

  const key = props.value;

  if (isSet(collection)) {
    const checked = collection.has(key);
    const toggle = () => (collection.has(key) ? collection.delete(key) : collection.add(key));
    return [checked, action(toggle)];
  } else {
    const array = collection as typeof key[];
    const checked = array.includes(key);
    const toggle = () => {
      const index = array.indexOf(key);
      if (index >= 0) {
        array.splice(index, 1);
      } else {
        array.push(key);
      }
    };
    return [checked, action(toggle)];
  }
}

function collectionCheck<TTarget, TProperty extends BindingProperty<TTarget>>(props: CollectionCheckProps<TTarget, TProperty>) {
  const [checked, toggle] = useCollection(props);

  const { value, ...otherProps } = omitBindingProps(props);
  const id = `${value}`;

  return <Form.Check id={id} {...otherProps} checked={checked} onChange={toggle} />;
}

export const CollectionCheck = observer(collectionCheck as any) as typeof collectionCheck;
