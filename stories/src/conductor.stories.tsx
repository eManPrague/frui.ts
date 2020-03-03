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

storiesOf("Conductor", module)
  .add("Single child", () => {
    const conductor = new SingleChildViewModel();

    return <View vm={conductor} useLifecycle={true} />;
  })
  .add("Children with one active", () => {
    const conductor = new OneChildActiveViewModel();

    return <View vm={conductor} useLifecycle={true} />;
  })
  .add("Children with all active", () => {
    const conductor = new AllChildrenActiveViewModel();

    return <View vm={conductor} useLifecycle={true} />;
  });
