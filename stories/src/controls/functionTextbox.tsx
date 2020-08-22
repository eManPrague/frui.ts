import { IBindingProps, useBinding } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";

function functionTextbox<TTarget>(props: IBindingProps<TTarget>) {
  const [value, setValue] = useBinding(props);
  const handleValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value as any);

  return <input type="text" value={value || ""} onChange={handleValueChanged} />;
}

const FunctionTextbox = observer(functionTextbox) as typeof functionTextbox;
export default FunctionTextbox;
