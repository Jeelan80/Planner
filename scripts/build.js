// Build script for production deployment

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building Auto Goal Planner...');

try {
  // Clean previous build
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true });
    console.log('✓ Cleaned previous build');
  }

  // Run Vite build
  execSync('vite build', { stdio: 'inherit' });
  console.log('✓ Build completed successfully');

  // Read package.json to get version
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  
  // Generate build info
  const buildInfo = {
    buildTime: new Date().toISOString(),
    version: packageJson.version,
    nodeVersion: process.version,
  };

  fs.writeFileSync(
    path.join('dist', 'build-info.json'),
    JSON.stringify(buildInfo, null, 2)
  );
  console.log('✓ Generated build info');

  // Copy additional assets if needed
  const assetsDir = path.join('src', 'assets');
  if (fs.existsSync(assetsDir)) {
    const distAssetsDir = path.join('dist', 'assets');
    if (!fs.existsSync(distAssetsDir)) {
      fs.mkdirSync(distAssetsDir, { recursive: true });
    }
    console.log('✓ Assets directory ready');
  }

  console.log('🎉 Build process completed successfully!');
  console.log('📦 Build output available in ./dist');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}