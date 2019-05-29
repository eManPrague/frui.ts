const path = require('path');

module.exports = ({ config }) => {
  config.module.rules = [{
    test: /\.(ts|tsx)$/,
    use: ['ts-loader', 'react-docgen-typescript-loader']
  }];
  config.resolve.extensions.push('.ts', '.tsx');

  config.module.rules.push({
    test: /\.stories\.tsx?$/,
    loaders: [{
      loader: require.resolve('@storybook/addon-storysource/loader'),
      options: { parser: 'typescript' },
    }],
    enforce: 'pre',
  });

  return config;
};
