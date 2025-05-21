module.exports = {
  browserslist: ['>= 0.25%', 'not dead'],
  minify: true,
  sourceMap: false,
  cssModules: {
    pattern: '[name]__[local]___[hash:base64:5]',
  },
  drafts: {
    customMedia: true,
    nesting: true,
  },
  targets: {
    chrome: 105,
    safari: 13,
  },
  analyzeDependencies: true,
  bundle: true,
  output: {
    cssModules: true,
    minify: true,
    sourceMap: false,
  },
};
