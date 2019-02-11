const path = require('path');

module.exports = (baseConfig, env, config) => {
  config.module.rules = [{
    test: /\.(ts|tsx)$/,
    use: ['ts-loader', 'react-docgen-typescript-loader']
  }];
  config.resolve.extensions.push('.ts', '.tsx');
  config.resolve.alias['@src'] = path.resolve(__dirname, '../src')

  config.module.rules.push({
    test: /\.stories\.tsx?$/,
    loaders: [require.resolve('@storybook/addon-storysource/loader')],
    enforce: 'pre',
  });

  return config;
};
