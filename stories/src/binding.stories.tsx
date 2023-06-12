import { useBinding } from "@frui.ts/views";
import { action, observable } from "mobx";
import { observer, Observer } from "mobx-react-lite";
import React from "react";

const observableTarget = observable({
  name: "John",
  age: 5,
  test: { foo: "bar" },
});

const MyComponent = observer(() => {
  const [name, setName] = useBinding({ target: observableTarget, property: "name" });

  return <input value={name as string} onChange={e => setName(e.target.value)} />;
});

export default {
  title: "useBinding",
};

export const Simple = () => {
  return (
    <>
      <MyComponent />

      <Observer>
        {() => (
          <dl>
            <dt>Name</dt>
            <dd>{observableTarget.name}</dd>
          </dl>
        )}
      </Observer>

      <button onClick={action(() => (observableTarget.name = "John"))}>Reset</button>
    </>
  );
};
