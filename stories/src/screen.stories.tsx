import { registerView, View } from "@frui.ts/views";
import { storiesOf } from "@storybook/react";
import { observable, runInAction } from "mobx";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import InheritedTestViewModel from "./viewModels/inheritedTestViewModel";

const config = observable({
  display: false,
  vm: null as InheritedTestViewModel,
});
const vm1 = new InheritedTestViewModel("View Model 1");
const vm2 = new InheritedTestViewModel("View Model 2");

const toggleDisplay = () => runInAction(() => (config.display = !config.display));
const selectVM = (e: React.ChangeEvent<HTMLInputElement>) =>
  runInAction(() => (config.vm = e.target.value === "1" ? vm1 : vm2));

const testView: React.FunctionComponent<{ vm: InheritedTestViewModel }> = ({ vm }) => (
  <p>This is a view for {vm.name}.</p>
);
registerView(testView, InheritedTestViewModel);

storiesOf("Screen", module)
  .addDecorator(story => (
    <Observer>
      {() => (
        <>
          <header>
            <p>Toggle the display view checkbox and check console for lifecycle events.</p>

            <div>
              <label>
                Display view: <input type="checkbox" onChange={toggleDisplay} checked={config.display} />
              </label>
            </div>

            <label>
              View Model 1
              <input type="radio" value="1" name="selectedvm" onChange={selectVM} />
            </label>
            <label>
              View Model 2
              <input type="radio" value="2" name="selectedvm" onChange={selectVM} />
            </label>
          </header>
          {story()}
        </>
      )}
    </Observer>
  ))
  .add("Screen lifecycle", () => config.display && <View vm={config.vm} useLifecycle={true} />);
