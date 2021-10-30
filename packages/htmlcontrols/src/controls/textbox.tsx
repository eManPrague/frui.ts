import type { BindingProperty, BindingTarget } from "@frui.ts/helpers";
import type { IBindingProps } from "@frui.ts/views";
import { useBinding } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";

type TextboxProps<TTarget extends BindingTarget, TProperty extends BindingProperty<TTarget>> = IBindingProps<
  TTarget,
  TProperty,
  string
> &
  React.InputHTMLAttributes<HTMLInputElement>;

function textbox<TTarget extends BindingTarget, TProperty extends BindingProperty<TTarget>>(
  props: TextboxProps<TTarget, TProperty>
) {
  const [value, setValue] = useBinding(props);
  const handleValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  return <input type="text" value={value || ""} onChange={handleValueChanged} />;
}

const Textbox = observer(textbox as any) as typeof textbox;
export default Textbox;
