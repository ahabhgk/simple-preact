module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'plugin:react-hooks/recommended',
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'react/no-deprecated': 'off',
    'react/prop-types': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'max-classes-per-file': 'off',
    'react/destructuring-assignment': 'off',
    'react/no-access-state-in-setstate': 'off',
    'no-param-reassign': 'off',
    'no-use-before-define': 'off',
    'import/no-cycle': 'off',
    'import/prefer-default-export': 'off',
    'no-multi-assign': 'off',
    'new-cap': 'off',
    'no-lonely-if': 'off',
    'no-plusplus': 'off',
    'quote-props': 'off',
    'eqeqeq': 'off',
    'no-nested-ternary': 'off',
  },
};
