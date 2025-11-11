import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Copy manifest.json to dist
fs.copyFileSync(
  path.join(__dirname, 'manifest.json'),
  path.join(__dirname, 'dist', 'manifest.json')
);

// Copy icons to dist
fs.copyFileSync(
  path.join(__dirname, 'public', 'icon48.png'),
  path.join(__dirname, 'dist', 'icon48.png')
);

fs.copyFileSync(
  path.join(__dirname, 'public', 'icon128.png'),
  path.join(__dirname, 'dist', 'icon128.png')
);

// Move popup.html to dist root
if (fs.existsSync(path.join(__dirname, 'dist', 'src', 'popup', 'popup.html'))) {
  fs.copyFileSync(
    path.join(__dirname, 'dist', 'src', 'popup', 'popup.html'),
    path.join(__dirname, 'dist', 'popup.html')
  );
}

// Clean up nested src folder
if (fs.existsSync(path.join(__dirname, 'dist', 'src'))) {
  fs.rmSync(path.join(__dirname, 'dist', 'src'), { recursive: true, force: true });
}

console.log('✓ Manifest, icons, and popup.html copied to dist/');
console.log('✓ Build complete! Load the dist/ folder in Chrome.');
