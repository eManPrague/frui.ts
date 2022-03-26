const reactPlugin = require("@vitejs/plugin-react");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: "@storybook/react",
  core: {
    builder: "storybook-builder-vite",
  },
  async viteFinal(config, { configType }) {
    config.plugins = [
      ...config.plugins.filter(plugin => {
        return !(Array.isArray(plugin) && plugin[0].name === "vite:react-babel");
      }),
      reactPlugin({
        exclude: [/\.stories\.(t|j)sx?$/, /node_modules/],
        babel: {
          parserOpts: {
            plugins: ["decorators-legacy"],
          },
        },
      }),
    ];
    return config;
  },
};
