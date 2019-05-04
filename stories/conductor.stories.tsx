import View from "@src/views/view";
import { storiesOf } from "@storybook/react";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import AllChildrenActiveViewModel from "./controls/allChildrenActiveViewModel";
import "./controls/childView";
import OneChildActiveViewModel from "./controls/oneChildActiveViewModel";
import SingleChildViewModel from "./controls/singleChildViewModel";

// tslint:disable: jsx-no-lambda
storiesOf("Conductor", module)
  .add("Single child", () => {
    const conductor = new SingleChildViewModel();
    conductor.activate();

    return <div>
      Choose view model: &nbsp;
      <button onClick={conductor.selectChild1}>One</button>
      <button onClick={conductor.selectChild2}>Two</button>

      <Observer>{() => <View vm={conductor.activeItem} />}</Observer>
    </div>;
  })
  .add("Children with one active", () => {
    const conductor = new OneChildActiveViewModel();
    conductor.activate();

    return <div>
      Choose view model: &nbsp;
      <Observer>{() =>
        <React.Fragment>
          {conductor.items.map(x => <button key={x.title} onClick={() => conductor.activateItem(x)}>{x.title}</button>)}
        </React.Fragment>}
      </Observer>
      &nbsp;
      <button onClick={conductor.addChild}>+</button>

      <Observer>{() => <View vm={conductor.activeItem} />}</Observer>
    </div>;
  })
  .add("Children with all active", () => {
    const conductor = new AllChildrenActiveViewModel();
    conductor.activate();

    return <div>
      Child view models: &nbsp;
      <button onClick={conductor.addChild}>+</button>

      <Observer>{() => <React.Fragment>
        {conductor.items.map(x => <View key={x.title} vm={x} />)}
      </React.Fragment>}</Observer>
    </div>;
  });
