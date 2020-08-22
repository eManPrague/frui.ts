import { BindingProperty, isSet } from "@frui.ts/helpers";
import { getValue, IBindingProps, omitBindingProps } from "@frui.ts/views";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";

type SetOrArrayInnerType<TTarget, TProperty extends keyof TTarget> = TTarget[TProperty] extends Set<infer TSetValue>
  ? TSetValue
  : TTarget[TProperty] extends Array<infer TArrayValue>
  ? TArrayValue
  : never;

export interface CollectionCheckboxProps<TTarget, TProperty extends BindingProperty<TTarget>>
  extends IBindingProps<TTarget, TProperty> {
  value: TProperty extends keyof TTarget ? SetOrArrayInnerType<TTarget, TProperty> : any;
}

function useCollection<TTarget, TProperty extends BindingProperty<TTarget>>(
  props: CollectionCheckboxProps<TTarget, TProperty>
): [boolean, () => void] {
  const collection = getValue(props);

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

function collectionCheckbox<TTarget, TProperty extends BindingProperty<TTarget>>(
  props: CollectionCheckboxProps<TTarget, TProperty>
) {
  const [checked, toggle] = useCollection(props);

  const { value, ...restProps } = omitBindingProps(props);
  return <input {...restProps} type="checkbox" checked={!!checked} onChange={toggle} />;
}

const CollectionCheckbox = observer(collectionCheckbox as any) as typeof collectionCheckbox;

export default CollectionCheckbox;
