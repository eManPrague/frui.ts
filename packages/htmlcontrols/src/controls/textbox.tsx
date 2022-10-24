import type { BindingTarget, TypedBindingProperty } from "@frui.ts/helpers";
import type { WithBindingProps } from "@frui.ts/views";
import { omitBindingProps, useBinding } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import type { ComponentPropsWithoutRef } from "react";
import React from "react";

function textbox<
  TRestriction extends string,
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, TRestriction>
>(props: WithBindingProps<ComponentPropsWithoutRef<"input">, TRestriction, TTarget, TProperty>) {
  const [value, setValue] = useBinding<TRestriction, TTarget, TProperty>(props);
  const handleValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value as TRestriction);

  return <input type="text" {...omitBindingProps(props)} value={value || ""} onChange={handleValueChanged} />;
}

const Textbox = observer(textbox);
export default Textbox;
