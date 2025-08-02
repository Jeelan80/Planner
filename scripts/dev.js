// Development server with enhanced features

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

console.log('🔧 Starting Auto Goal Planner development server...');

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
}

// Create .env.local if it doesn't exist
const envLocalPath = '.env.local';
if (!fs.existsSync(envLocalPath)) {
  const defaultEnv = `# Auto Goal Planner - Local Development Environment
VITE_APP_NAME=Auto Goal Planner
VITE_APP_VERSION=${require('../package.json').version}
VITE_STORAGE_PREFIX=autoGoalPlanner_dev_
`;
  
  fs.writeFileSync(envLocalPath, defaultEnv);
  console.log('✓ Created .env.local file');
}

// Start development server
try {
  console.log('🚀 Starting Vite development server...');
  execSync('npx vite', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to start development server:', error.message);
  process.exit(1);
}