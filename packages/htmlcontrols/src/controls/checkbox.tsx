import { BindingComponent, IBindingProps } from "@frui.ts/views";
import bind from "bind-decorator";
import { Observer } from "mobx-react-lite";
import * as React from "react";

type CheckboxProps<TTarget> = IBindingProps<TTarget> & React.InputHTMLAttributes<HTMLInputElement>;

export class Checkbox<TTarget> extends BindingComponent<CheckboxProps<TTarget>, TTarget> {
  render() {
    return (
      <Observer>
        {() => <input {...this.inheritedProps} type="checkbox" checked={!!this.value} onChange={this.handleValueChanged} />}
      </Observer>
    );
  }

  @bind
  protected handleValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
    this.setValue(e.target.checked);
  }
}
