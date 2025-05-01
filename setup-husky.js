import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // Initialize Husky
  execSync('npx husky init', { stdio: 'inherit' });

  // Create .husky directory if it doesn't exist
  const huskyDir = path.join(__dirname, '.husky');
  if (!fs.existsSync(huskyDir)) {
    fs.mkdirSync(huskyDir);
  }

  // Create pre-commit hook
  const preCommitPath = path.join(huskyDir, 'pre-commit');
  const preCommitHook = `${process.platform === 'win32' ? 'npx.cmd' : 'npx'} lint-staged`;
  fs.writeFileSync(preCommitPath, preCommitHook);

  // Make hooks executable
  if (process.platform !== 'win32') {
    execSync(`chmod +x ${preCommitPath}`, { stdio: 'inherit' });
  }

  console.log('Husky has been set up with pre-commit hook');
} catch (error) {
  console.error('Error setting up Husky:', error);
  process.exit(1);
}
