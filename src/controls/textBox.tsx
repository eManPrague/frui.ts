import bind from "bind-decorator";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import { BindingComponent, IBindingProps } from "./bindingComponent";

export class TextBox extends BindingComponent<IBindingProps<any>, any> {
  render() {
    return (
      <Observer>
        {() => <input {...this.inheritedProps} type="text" value={this.value || ""} onChange={this.handleValueChanged} />}
      </Observer>
    );
  }

  @bind
  protected handleValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
    this.setValue(e.target.value);
  }
}
