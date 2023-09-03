import type { BindingTarget, TypedBindingProperty } from "@frui.ts/helpers";
import { Checkbox } from "@frui.ts/htmlcontrols";
import type { WithBindingProps } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";

function check<
  TRestriction extends boolean | undefined,
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, TRestriction>,
>(props: WithBindingProps<{ id: string; label: string }, TRestriction, TTarget, TProperty>) {
  const { label, ...rest } = props;
  return (
    <label>
      {label}
      <Checkbox {...(rest as any)} />
    </label>
  );
}

const Check = observer(check);
export default Check;
