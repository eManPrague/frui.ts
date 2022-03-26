import type { BindingProperty } from "@frui.ts/helpers";
import type { IBindingProps } from "../src/binding/bindingProps";
import { getValue, setValue, useBinding } from "../src/binding/useBinding";

interface MyProps<TTarget, TProperty extends BindingProperty<TTarget>> extends IBindingProps<TTarget, TProperty, number[]> {
  required: string;
}

function testComponent<TTarget, TProperty extends BindingProperty<TTarget>>(props: MyProps<TTarget, TProperty>) {
  if (props.property && props.target) {
    props.onValueChanged?.([99], props.property, props.target);
  }

  const value = getValue(props.target, props.property) as number[]; // TODO can have this strongly typed, or at least restricted by the component
  setValue(props.target, props.property, [99] as any);

  const [value2, setValue2] = useBinding(props);
  setValue2([99]);

  return value[0] || value2[0];
}

test("Typings in binding props", () => {
  const target = { numberValue: 123, numbers: [1, 2, 3], text: "string" };

  // one day, this should raise error, since `target.text` is of type string, instead of number[] as defined in the component's props
  testComponent({ target, property: "text", required: "here" });
});
