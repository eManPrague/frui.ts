import { bound } from "@frui.ts/helpers";
import * as React from "react";
import { Form, FormControlProps } from "react-bootstrap";
import { ValidationControlBase } from "./validationControlBase";

export interface SelectProps<TItem> {
  items: TItem[];
  keyProperty?: keyof TItem & string;
  textProperty?: keyof TItem & string;
  mode?: "key" | "item";
  allowEmpty?: boolean;
  emptyText?: string;
  isNumeric?: boolean;
}

const EMPTY_VALUE = "";

export class Select<TTarget, TItem> extends ValidationControlBase<TTarget, FormControlProps & SelectProps<TItem>> {
  static defaultProps: Partial<SelectProps<any>> = {
    keyProperty: "id",
    textProperty: "label",
    mode: "item",
  };

  protected get inheritedProps() {
    const { target, property, onValueChanged, isNumeric, ...otherProps } = this.props;

    return otherProps;
  }

  @bound
  protected renderInner() {
    const {
      noValidation,
      errorMessage,
      items,
      keyProperty,
      textProperty,
      mode,
      allowEmpty,
      emptyText,
      ...otherProps
    } = this.inheritedProps;
    const validationError = this.getValidationError();

    const options = items.map((x: any) => (
      <option key={x[keyProperty]} value={x[keyProperty]}>
        {!!textProperty ? x[textProperty] : x}
      </option>
    ));
    return (
      <>
        <Form.Control
          {...otherProps}
          as="select"
          value={this.selectedValue ?? EMPTY_VALUE}
          onChange={this.handleValueChanged}
          isInvalid={!!validationError}>
          {(allowEmpty || !this.hasValidValue) && <option value={EMPTY_VALUE}>{emptyText}</option>}
          {options}
        </Form.Control>
        {validationError && <Form.Control.Feedback type="invalid">{validationError}</Form.Control.Feedback>}
      </>
    );
  }

  get selectedValue(): any {
    const { mode, keyProperty } = this.props;
    return mode === "item" && this.value && keyProperty !== undefined ? (this.value as TItem)[keyProperty] : this.value;
  }

  get hasValidValue() {
    const { items, keyProperty } = this.props;

    return items.findIndex((x: any) => x[keyProperty] == this.selectedValue) !== -1; // key might be a number, compare with '==' only
  }

  @bound
  protected handleValueChanged(e: React.FormEvent<any>) {
    const target = e.target as HTMLSelectElement;
    const selectedKey = target.value;

    if (this.props.allowEmpty && selectedKey === EMPTY_VALUE) {
      this.setValue(null);
      return;
    }

    if (this.props.mode === "item") {
      const { items, keyProperty } = this.props;
      const selectedItem = items.find((x: any) => x[keyProperty] == selectedKey); // key might be a number, compare with '==' only
      this.setValue(selectedItem);
    } else {
      this.setValue(this.props.isNumeric ? parseInt(selectedKey, 10) : selectedKey);
    }
  }
}
