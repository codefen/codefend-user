/** @type {import('stylelint').Config} */
module.exports = {
  extends: ['stylelint-config-standard-scss'],
  ignoreFiles: [
    'node_modules/**',
    'dist/**',
    '__test__/**',
    '.vscode/**',
    'public/**',
    'src-tauri/**',
  ],
  overrides: [
    {
      files: ['*.js'],
      customSyntax: 'postcss-lit',
    },
  ],
  rules: {
    'custom-property-empty-line-before': null,
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'keyframes-name-pattern': null,
    'custom-property-pattern': null,
    'property-no-vendor-prefix': null,
    'scss/at-mixin-pattern': null,
    'font-family-no-missing-generic-family-keyword': null,
    'media-feature-range-notation': null,
    'hue-degree-notation': null,
    'value-no-vendor-prefix': null,
    'selector-no-vendor-prefix': null,
    'number-max-precision': null,
    'declaration-empty-line-before': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'color-hex-length': null,
  },
};
