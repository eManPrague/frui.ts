// tslint:disable: jsx-no-lambda
import { Observer, useObservable } from "mobx-react-lite";
import * as React from "react";

export default function TestControl(props: any) {
  const person = useObservable({ name: "John" });
  return (
    <div>
      {person.name}
      <Observer>{() => <div>{person.name}</div>}</Observer>
      <button onClick={() => (person.name = "Mike")}>No! I am Mike</button>
    </div>
  );
}
