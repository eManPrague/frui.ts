import type { BindingTarget, TypedBindingProperty } from "@frui.ts/helpers";
import { Textbox } from "@frui.ts/htmlcontrols";
import type { WithBindingProps } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";

function input<
  TRestriction extends string | undefined,
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, TRestriction>
>(props: WithBindingProps<{ label?: string }, TRestriction, TTarget, TProperty>) {
  const { label, ...rest } = props;
  return (
    <label>
      {label}
      <Textbox {...(rest as any)} />
    </label>
  );
}

const Input = observer(input);
export default Input;
