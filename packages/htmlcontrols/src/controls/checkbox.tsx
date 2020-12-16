import { BindingTarget, bound } from "@frui.ts/helpers";
import { BindingComponent, IBindingProps } from "@frui.ts/views";
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
