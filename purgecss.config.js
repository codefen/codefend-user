module.exports = {
  content: ['./src/**/*.tsx', './src/**/*.ts', './src/**/*.jsx', './src/**/*.js', './index.html'],
  safelist: {
    standard: [/^codefend-/, /^tox-/, /^tinymce-/],
    deep: [/^codefend-/, /^tox-/, /^tinymce-/],
    greedy: [/^codefend-/, /^tox-/, /^tinymce-/],
  },
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
  fontFace: true,
  keyframes: true,
  variables: true,
  rejected: true,
};
