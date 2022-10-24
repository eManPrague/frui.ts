import type { BindingTarget, TypedBindingProperty } from "@frui.ts/helpers";
import { isSet } from "@frui.ts/helpers";
import type { WithBindingProps } from "@frui.ts/views";
import { getValue, omitBindingProps } from "@frui.ts/views";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import type { ComponentPropsWithoutRef } from "react";
import React from "react";

type CollectionCheckboxProps<TItem> = { value: TItem };

function useCollection<
  TItem,
  TRestriction extends TItem[] | Set<TItem> | undefined,
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, TRestriction>
>(props: WithBindingProps<CollectionCheckboxProps<TItem>, TRestriction, TTarget, TProperty>): [boolean, () => void] {
  const collection = getValue<TRestriction, TTarget, TProperty>(props.target, props.property);

  if (!collection) {
    throw new Error("The target value must be an array or a Set");
  }

  const key = props.value;

  if (isSet(collection)) {
    const checked = collection.has(key);
    const toggle = () => (collection.has(key) ? collection.delete(key) : collection.add(key));
    return [checked, action(toggle)];
  } else {
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
  }
}

function collectionCheckbox<
  TItem,
  TRestriction extends TItem[] | Set<TItem> | undefined,
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, TRestriction>
>(props: WithBindingProps<CollectionCheckboxProps<TItem> & ComponentPropsWithoutRef<"input">, TRestriction, TTarget, TProperty>) {
  const [checked, toggle] = useCollection<TItem, TRestriction, TTarget, TProperty>(props);

  const { value, ...restProps } = omitBindingProps(props);
  return <input {...restProps} type="checkbox" checked={!!checked} onChange={toggle} />;
}

const CollectionCheckbox = observer(collectionCheckbox);
export default CollectionCheckbox;
