const expo = require('eslint-config-expo/flat');

module.exports = [
  ...expo,
  {
    ignores: ['dist/*', '.expo/*', 'android/*', 'ios/*', 'node_modules/*'],
  },
  {
    files: ['scripts/**/*.js', 'plugins/**/*.js', 'app.config.js', 'eslint.config.js'],
    languageOptions: { globals: { __dirname: 'readonly', process: 'readonly', console: 'readonly', require: 'readonly', module: 'readonly' } },
  },
  {
    rules: {
      // arrow-function components and inline styles are used throughout; keep the signal, drop the noise
      'react/display-name': 'off',
      // Reanimated shared values are assigned with `.value =`, which this rule reports as a mutation
      'react-hooks/immutability': 'off',
    },
  },
];
