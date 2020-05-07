import { bound } from "@frui.ts/helpers";
import { BindingComponent, IBindingProps } from "@frui.ts/views";
import { Observer } from "mobx-react-lite";
import * as React from "react";

type TextboxProps<TTarget> = IBindingProps<TTarget> & React.InputHTMLAttributes<HTMLInputElement>;

export class Textbox<TTarget> extends BindingComponent<TTarget, TextboxProps<TTarget>> {
  render() {
    return (
      <Observer>
        {() => <input {...this.inheritedProps} type="text" value={this.value || ""} onChange={this.handleValueChanged} />}
      </Observer>
    );
  }

  @bound
  protected handleValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
    this.setValue(e.target.value);
  }
}
