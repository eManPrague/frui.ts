import "@storybook/addon-console";
import { configure, setAddon } from "@storybook/react";

const req = require.context("../src", true, /.stories.tsx$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
