import { BindingProperty } from "@frui.ts/helpers";
import { IBindingProps, useBinding } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";

type TextboxProps<TTarget, TProperty extends BindingProperty<TTarget>> = IBindingProps<TTarget, TProperty> &
  React.InputHTMLAttributes<HTMLInputElement>;

function textbox<TTarget, TProperty extends BindingProperty<TTarget>>(props: TextboxProps<TTarget, TProperty>) {
  const [value, setValue] = useBinding(props.target, props.property);
  const handleValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value as any);

  return <input type="text" value={(value as string) || ""} onChange={handleValueChanged} />;
}

const Textbox = observer(textbox as any) as typeof textbox;
export default Textbox;
