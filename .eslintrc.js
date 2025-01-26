module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
    'react/no-unstable-nested-components': ['error', {allowAsProps: true}],
  },
};
