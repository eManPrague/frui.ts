import type { BindingTarget, TypedBindingProperty } from "@frui.ts/helpers";
import { bound } from "@frui.ts/helpers";
import { BindingComponent } from "@frui.ts/views";
import { Observer } from "mobx-react-lite";
import React from "react";

export class Checkbox<
  TRestriction extends boolean | undefined,
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, TRestriction>
> extends BindingComponent<React.ComponentPropsWithoutRef<"input">, TRestriction, TTarget, TProperty> {
  render() {
    return (
      <Observer>
        {() => <input {...this.inheritedProps} type="checkbox" checked={!!this.value} onChange={this.handleValueChanged} />}
      </Observer>
    );
  }

  @bound
  protected handleValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
    this.setValue(e.target.checked as TRestriction);
  }
}
