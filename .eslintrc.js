module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    // Relax some style rules so they don't fail CI while keeping them visible
    'comma-dangle': 'off',
    'no-shadow': 'off',
    'no-unused-vars': ['warn', {argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],
    'quotes': 'warn',
    'eol-last': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react/no-unstable-nested-components': 'warn',
  },
};
