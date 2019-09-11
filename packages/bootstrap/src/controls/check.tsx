import { BindingComponent, IBindingProps } from "@frui.ts/views";
import bind from "bind-decorator";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import { Form, FormCheckProps } from "react-bootstrap";
import { CommonInputProps } from "./commonInputProps";

export class Check<TTarget> extends BindingComponent<
  FormCheckProps & CommonInputProps & IBindingProps<TTarget>,
  TTarget
> {
  render() {
    return (
      <Observer>
        {() => <Form.Check {...this.inheritedProps} checked={!!this.value} onChange={this.handleValueChanged} />}
      </Observer>
    );
  }

  @bind protected handleValueChanged(e: React.FormEvent<any>) {
    const target = e.target as HTMLInputElement;
    this.setValue(target.checked);
  }
}
