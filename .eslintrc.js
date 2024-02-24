module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  overrides: [
    {
      files: ['*'],
      rules: { '@typescript-eslint/no-explicit-any': 'off' },
    },
    {
      files: ['*'],
      rules: { '@typescript-eslint/ban-ts-comment': 'off' },
    },
    {
      files: ['*'],
      rules: { '@typescript-eslint/no-var-requires': 'off' },
    },
  ],
};
