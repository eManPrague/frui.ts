import bind from "bind-decorator";
import { Observer } from "mobx-react-lite";
import React = require("react");
import { BindingComponent, IBindingProps } from "./bindingComponent";

export class TextBox extends BindingComponent<IBindingProps<any>, any> {
  public render() {
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
