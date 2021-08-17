import { Observer } from "mobx-react-lite";
import React from "react";
import { bound } from "@frui.ts/helpers";
import { BindingComponent, IBindingProps } from "@frui.ts/views";
import { Form, FormLabelProps } from "react-bootstrap";

export interface LabelProps {
  required: boolean | "autoDetect";
  requiredMarker?: React.ReactNode;
}

export class Label<TTarget> extends BindingComponent<TTarget, IBindingProps<TTarget> & LabelProps & FormLabelProps> {
  static defaultProps = {
    required: "autoDetect",
    requiredMarker: <span className="text-danger pl-1">*</span>,
  };

  @bound
  protected renderInner() {
    const { children, target, property, requiredMarker, required, ...rest } = this.props;
    const entity = target as any;
    let requiredNode;

    if (
      required === true ||
      (required === "autoDetect" && entity?.__validation?.requiredProperties.includes(property as string))
    ) {
      requiredNode = requiredMarker;
    }

    return (
      <Form.Label {...rest}>
        {children}
        {requiredNode}
      </Form.Label>
    );
  }

  render() {
    return <Observer render={this.renderInner} />;
  }
}
