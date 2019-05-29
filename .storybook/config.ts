import "@storybook/addon-console";
import { configure, setAddon } from "@storybook/react";

const req = require.context("../stories/src", true, /.stories.tsx$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
