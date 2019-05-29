import { registerView, View } from "@frui.ts/views";
import { storiesOf } from "@storybook/react";
import { observable, runInAction } from "mobx";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import InheritedTestViewModel from "./viewModels/inheritedTestViewModel";

const config = observable({
  display: false,
});
const toggleDisplay = () => runInAction(() => config.display = !config.display);

const inheritedViewModel = new InheritedTestViewModel();
const testView: React.FunctionComponent<{ vm: any }> = ({ vm }) => <p>This is a view for {vm.constructor.name}.</p>;
registerView(testView, InheritedTestViewModel);

storiesOf("Screen", module)
  .addDecorator(story => <Observer>{() =>
    <div>
      <p>Toggle the display view checkbox and check console for lifecycle events.</p>
      <div><label>Display view: <input type="checkbox" onChange={toggleDisplay} checked={config.display} /></label></div>
      {story()}
    </div>
  }</Observer>)
  .add("Screen lifecycle", () => config.display && <View vm={inheritedViewModel} />);
