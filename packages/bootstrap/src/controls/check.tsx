import { bound } from "@frui.ts/helpers";
import { BindingComponent, IBindingProps } from "@frui.ts/views";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import { Form, FormCheckProps } from "react-bootstrap";
import { CommonInputProps } from "./commonInputProps";

export class Check<TTarget> extends BindingComponent<TTarget, FormCheckProps & CommonInputProps & IBindingProps<TTarget>> {
  render() {
    return (
      <Observer>
        {() => (
          <Form.Check
            id={this.props.property}
            {...this.inheritedProps}
            checked={!!this.value}
            onChange={this.handleValueChanged}
          />
        )}
      </Observer>
    );
  }

  @bound
  protected handleValueChanged(e: React.FormEvent<any>) {
    const target = e.target as HTMLInputElement;
    this.setValue(target.checked);
  }
}
