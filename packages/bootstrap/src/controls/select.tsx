import { getValidationMessage } from "@frui.ts/validation";
import { BindingComponent, IBindingProps } from "@frui.ts/views";
import bind from "bind-decorator";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import { Form, FormControlProps } from "react-bootstrap";
import { CommonInputProps } from "./commonInputProps";

export interface SelectProps<TItem> {
  items: TItem[];
  keyProperty?: keyof TItem & string;
  textProperty?: keyof TItem & string;
  mode?: "key" | "item";
  allowEmpty?: boolean;
}

const EMPTY_VALUE = "";

export class Select<TTarget, TItem> extends BindingComponent<
  FormControlProps & CommonInputProps & SelectProps<TItem> & IBindingProps<TTarget>,
  TTarget
> {
  static defaultProps: Partial<SelectProps<any>> = {
    keyProperty: "id",
    textProperty: "label",
    mode: "item",
  };

  render() {
    return <Observer render={this.renderInner} />;
  }

  @bind protected renderInner() {
    const {
      noValidation,
      errorMessage,
      items,
      keyProperty,
      textProperty,
      mode,
      allowEmpty,
      ...otherProps
    } = this.inheritedProps;
    const validationError =
      noValidation !== true && (errorMessage || getValidationMessage(this.props.target, this.props.property));

    const options = items.map((x: any) => (
      <option key={x[keyProperty]} value={x[keyProperty]}>
        {!!textProperty ? x[textProperty] : x}
      </option>
    ));
    const selectedValue = mode === "item" && this.value ? this.value[keyProperty] : this.value;

    return (
      <>
        <Form.Control
          {...otherProps}
          as="select"
          value={selectedValue || EMPTY_VALUE}
          onChange={this.handleValueChanged}
          isInvalid={!!validationError}>
          {allowEmpty && <option value={EMPTY_VALUE} />}
          {options}
        </Form.Control>
        {validationError && <Form.Control.Feedback type="invalid">{validationError}</Form.Control.Feedback>}
      </>
    );
  }

  @bind protected handleValueChanged(e: React.FormEvent<any>) {
    const target = e.target as HTMLSelectElement;
    const selectedKey = target.value;

    if (this.props.allowEmpty && selectedKey === EMPTY_VALUE) {
      this.setValue(null);
      return;
    }

    if (this.props.mode === "item") {
      const { items, keyProperty } = this.props;
      // tslint:disable-next-line:triple-equals
      const selectedItem = items.find((x: any) => x[keyProperty] == selectedKey); // key might be a number, compare with '==' only
      this.setValue(selectedItem);
    } else {
      this.setValue(selectedKey);
    }
  }
}
