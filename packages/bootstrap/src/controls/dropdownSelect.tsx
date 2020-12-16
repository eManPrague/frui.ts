import { BindingProperty, BindingTarget } from "@frui.ts/helpers";
import { IBindingProps, useBinding } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";
import { ButtonProps as ButtonBootstrapProps, Dropdown as DropdownBootstrap } from "react-bootstrap";
import { DropdownToggleProps as DropdownToggleBootstrapProps } from "react-bootstrap/DropdownToggle";
import { Select } from "./select";

interface DropdownBaseProps {
  id: DropdownToggleBootstrapProps["id"];
  variant?: ButtonBootstrapProps["variant"];
  size?: ButtonBootstrapProps["size"];
  block?: ButtonBootstrapProps["block"];
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  renderOnMount?: boolean;
}

export interface DropdownSelectProps<TTarget extends BindingTarget, TProperty extends BindingProperty<TTarget>, TItem>
  extends DropdownBaseProps,
    IBindingProps<TTarget, TProperty> {
  items: TItem[];
  keyProperty?: (keyof TItem & string) | "";
  textProperty?: (keyof TItem & string) | "";
  mode?: "key" | "item";
  onChanged?: (selectedItem: TItem) => any;
}

function propertyValue(target: any, key: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return target && key ? target[key] : target;
}

function DropdownSelectImpl<TTarget extends BindingTarget, TProperty extends BindingProperty<TTarget>, TItem>(
  props: DropdownSelectProps<TTarget, TProperty, TItem>
) {
  const { mode, items, keyProperty, textProperty, onChanged } = props;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [value, setValue] = useBinding(props);

  const selectedItem = mode === "item" ? (value as TItem) : items.find(x => propertyValue(x, keyProperty) === value);
  const title = propertyValue(selectedItem, textProperty) as string;

  const onClickHandler = (item: TItem) => () => {
    setValue(mode === "item" ? item : propertyValue(item, keyProperty));
    onChanged?.(item);
  };
  const children = items.map(x => (
    <DropdownBootstrap.Item key={propertyValue(x, keyProperty) as string | number} onClick={onClickHandler(x)}>
      {propertyValue(x, textProperty)}
    </DropdownBootstrap.Item>
  ));

  const className = props.className ? "dropdown-select " + props.className : "dropdown-select";
  return (
    <DropdownBootstrap className={className}>
      <DropdownBootstrap.Toggle
        variant={props.variant}
        size={props.size}
        disabled={props.disabled}
        id={props.id}
        className={props.block ? "btn btn-block" : "btn"}>
        {title || (props.placeholder && <span className="placeholder">{props.placeholder}</span>)}
      </DropdownBootstrap.Toggle>
      <DropdownBootstrap.Menu renderOnMount={props.renderOnMount} className="dropdown-select__menu">
        {children}
      </DropdownBootstrap.Menu>
    </DropdownBootstrap>
  );
}

DropdownSelectImpl.defaultProps = Select.defaultProps as Partial<DropdownSelectProps<any, any, any>>;

export const DropdownSelect = observer(DropdownSelectImpl as any) as typeof DropdownSelectImpl;
