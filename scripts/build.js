// Build script for production deployment

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Auto Goal Planner...');

try {
  // Clean previous build
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true });
    console.log('✓ Cleaned previous build');
  }

  // Run build
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✓ Build completed successfully');

  // Generate build info
  const buildInfo = {
    buildTime: new Date().toISOString(),
    version: require('../package.json').version,
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