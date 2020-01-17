import { BindingComponent, IBindingProps, ISelectItem } from "@frui.ts/views";
import bind from "bind-decorator";
import { Observer } from "mobx-react-lite";
import * as React from "react";

interface IDropDownProps<T> extends IBindingProps<T> {
  options: ISelectItem[];
  allowEmpty?: boolean;
  className?: string;
}

export class DropDown extends BindingComponent<IDropDownProps<any>, any> {
  render() {
    return (
      <Observer>
        {() => <select className={this.props.className} value={cleanupValue(this.value)} onChange={this.handleValueChanged}>
          {this.props.allowEmpty && <option value={undefined} />}

          {this.props.options && this.props.options.map(x => <option key={x.value || 0} value={x.value}>{x.label}</option>)}
        </select>
        }
      </Observer>
    );
  }

  @bind
  protected handleValueChanged(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setValue(e.target.value);
  }
}

function cleanupValue(value: any) {
  return value === 0 ? value : (value || "");
}
