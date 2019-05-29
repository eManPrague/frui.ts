import { View } from "@frui.ts/views";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import AllChildrenActiveViewModel from "./viewModels/allChildrenActiveViewModel";
import OneChildActiveViewModel from "./viewModels/oneChildActiveViewModel";
import SingleChildViewModel from "./viewModels/singleChildViewModel";
import "./views/allChildrenActiveView";
import "./views/childView";
import "./views/oneChildActiveView";
import "./views/singleChildView";

// tslint:disable: jsx-no-lambda
storiesOf("Conductor", module)
  .add("Single child", () => {
    const conductor = new SingleChildViewModel();
    conductor.activate();

    return <View vm={conductor} />;
  })
  .add("Children with one active", () => {
    const conductor = new OneChildActiveViewModel();
    conductor.activate();

    return <View vm={conductor} />;
  })
  .add("Children with all active", () => {
    const conductor = new AllChildrenActiveViewModel();
    conductor.activate();

    return <View vm={conductor} />;
  });
