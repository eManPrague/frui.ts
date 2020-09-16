import { useBinding } from "@frui.ts/views";
import { storiesOf } from "@storybook/react";
import { action, observable } from "mobx";
import { observer, Observer } from "mobx-react-lite";
import * as React from "react";
import "./views/allChildrenActiveView";
import "./views/childView";
import "./views/oneChildActiveView";
import "./views/singleChildView";

const observableTarget = observable({
  name: "John",
  age: 5,
  test: { foo: "bar" },
});

const MyComponent = observer(() => {
  const [name, setName] = useBinding(observableTarget, "name");

  return <input value={name} onChange={e => setName(e.target.value)} />;
});

storiesOf("useBinding", module).add("Simple", () => {
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
});
