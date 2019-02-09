import { storiesOf } from "@storybook/react";
import * as React from "react";
import TestControl from "../src/controls/testControl";

storiesOf("Test", module)
  .add("default", () => {
    return <TestControl />;
  });
