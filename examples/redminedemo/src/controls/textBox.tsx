import { bound } from "@frui.ts/helpers";
import { BindingComponent, IBindingProps } from "@frui.ts/views";
import { Observer } from "mobx-react-lite";
import * as React from "react";

export class TextBox<TTarget> extends BindingComponent<TTarget, IBindingProps<TTarget>> {
  render() {
    return (
      <Observer>
        {() => (
          <input {...this.inheritedProps} type="text" value={(this.value as string) || ""} onChange={this.handleValueChanged} />
        )}
      </Observer>
    );
  }

  @bound
  protected handleValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
    this.setValue(e.target.value);
  }
}
