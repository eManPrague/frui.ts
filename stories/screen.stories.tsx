import View from "@src/views/view";
import { registerView } from "@src/views/viewLocator";
import { storiesOf } from "@storybook/react";
import { observable, runInAction } from "mobx";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import DecoratedViewModel from "./controls/decoratedTestViewModel";
import InheritedTestViewModel from "./controls/inheritedTestViewModel";

const config = observable({
  display: false,
});
const toggleDisplay = () => runInAction(() => config.display = !config.display);

const inheritedViewModel = new InheritedTestViewModel();
const decoratedViewModel = new DecoratedViewModel();
const testView: React.FunctionComponent<{ vm: any }> = ({ vm }) => <p>This is a view for {vm.constructor.name}.</p>;
registerView(testView, DecoratedViewModel);
registerView(testView, InheritedTestViewModel);

storiesOf("Screen", module)
  .addDecorator(story => <Observer>{() =>
    <div>
      <p>Toggle the display view checkbox and check console for lifecycle events.</p>
      <div><label>Display view: <input type="checkbox" onChange={toggleDisplay} checked={config.display} /></label></div>
      {story()}
    </div>
  }</Observer>)
  .add("Inherited screen lifecycle", () => config.display && <View vm={inheritedViewModel} />)
  .add("Decorated screen lifecycle", () => config.display && <View vm={decoratedViewModel} />);
