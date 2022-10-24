/* eslint-disable sonarjs/no-identical-functions */
import type { BindingTarget, PropertyType, TypedBindingProperty } from "@frui.ts/helpers";
import { describe, test } from "vitest";
import type { WithBindingProps } from "../src/binding/bindingProps";
import { getValue, setValue, useBinding } from "../src/binding/useBinding";

class Parent {
  name: string;
}

class Child extends Parent {
  age: number;
}

interface MyProps {
  required: string;
}

function numbersComponent<
  TRestriction extends number[],
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, TRestriction>
>(props: WithBindingProps<MyProps, TRestriction, TTarget, TProperty>) {
  if (props.property && props.target) {
    props.onValueChanged?.([99] as PropertyType<TTarget, TProperty>, props.property, props.target);
  }

  if (!props.target || !props.property) {
    throw new Error("Target is missing");
  }

  const value = getValue<TRestriction, TTarget, TProperty>(props.target, props.property);
  setValue<TRestriction, TTarget, TProperty>(props.target, props.property, [99] as PropertyType<TTarget, TProperty>);

  const [value2, setValue2] = useBinding<TRestriction, TTarget, TProperty>(props);
  setValue2(value2);

  return value[0] || value2[0];
}

function textComponent<
  TRestriction extends string,
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, TRestriction>
>(props: WithBindingProps<MyProps, TRestriction, TTarget, TProperty>) {
  const [value, setValue] = useBinding<TRestriction, TTarget, TProperty>(props);
  setValue(value);

  return value;
}

function nullableComponent<
  TRestriction extends string | undefined,
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, TRestriction>
>(props: WithBindingProps<MyProps, TRestriction, TTarget, TProperty>) {
  const [value, setValue] = useBinding<TRestriction, TTarget, TProperty>(props);
  setValue(value);

  return value;
}

function parentComponent<
  TRestriction extends Parent[],
  TTarget extends BindingTarget,
  TProperty extends TypedBindingProperty<TTarget, TRestriction>
>(props: WithBindingProps<MyProps, TRestriction, TTarget, TProperty>) {
  const [value, setValue] = useBinding<TRestriction, TTarget, TProperty>(props);
  setValue(value);

  return value;
}

interface ITarget {
  numberValue: number;
  numbers: number[];
  text: string;
  children: Child[];
  nullable?: string;
}

const target: ITarget = {
  numberValue: 123,
  numbers: [1, 2, 3],
  text: "string",
  children: [new Child()],
};

describe("BindingProps", () => {
  test("Typings for array", () => {
    numbersComponent({
      target,
      property: "numbers",
      required: "here",
      onValueChanged: x => sink<number[]>(x),
    });
  });

  test("Typings for text", () => {
    textComponent({
      target,
      property: "text",
      required: "here",
      onValueChanged: x => sink<string>(x),
    });
  });

  test("Typings for nullable", () => {
    nullableComponent({
      target,
      property: "nullable",
      required: "here",
      onValueChanged: x => sink<string | undefined>(x),
    });
  });

  test("Typings with inheritance", () => {
    parentComponent({
      target,
      property: "children",
      required: "here",
      onValueChanged: x => sink<Child[]>(x),
    });
  });
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
function sink<T>(_input: T) {}
