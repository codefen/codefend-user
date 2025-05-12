import path from 'node:path';

const buildEslintCommand = filenames =>
  `eslint --fix --report-unused-disable-directives --max-warnings 0 ${filenames
    .map(f => `"${path.relative(process.cwd(), f)}"`)
    .join(' ')}`;

const buildPrettierCommand = filenames =>
  `prettier --write ${filenames
    .map(f => `"${path.relative(process.cwd(), f)}"`)
    .join(' ')} --ignore-path .prettierignore`;

const config = {
  './src/**/*.{js,ts,tsx}': [buildPrettierCommand, buildEslintCommand],
  './src/**/*.{css,scss}': [buildPrettierCommand],
};
export default config;
