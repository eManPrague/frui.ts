import type { BindingTarget } from "@frui.ts/helpers";
import { bound } from "@frui.ts/helpers";
import type { IBindingProps } from "@frui.ts/views";
import { BindingComponent } from "@frui.ts/views";
import { Observer } from "mobx-react-lite";
import React from "react";

type CheckboxProps<TTarget extends BindingTarget> = IBindingProps<TTarget> & React.InputHTMLAttributes<HTMLInputElement>;

export class Checkbox<TTarget extends BindingTarget> extends BindingComponent<TTarget, CheckboxProps<TTarget>> {
  render() {
    return (
      <Observer>
        {() => <input {...this.inheritedProps} type="checkbox" checked={!!this.value} onChange={this.handleValueChanged} />}
      </Observer>
    );
  }

  @bound
  protected handleValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
    this.setValue(e.target.checked);
  }
}
