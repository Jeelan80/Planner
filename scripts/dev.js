// Development server with enhanced features

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);


console.log('🔧 Starting Auto Goal Planner fullstack development server...');

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  spawn('npm', ['install'], { stdio: 'inherit', shell: true });
}

// Create .env.local if it doesn't exist
const envLocalPath = '.env.local';
if (!fs.existsSync(envLocalPath)) {
  const defaultEnv = `# Auto Goal Planner - Local Development Environment\nVITE_APP_NAME=Auto Goal Planner\nVITE_APP_VERSION=${require('../package.json').version}\nVITE_STORAGE_PREFIX=autoGoalPlanner_dev_\n`;
  fs.writeFileSync(envLocalPath, defaultEnv);
  console.log('✓ Created .env.local file');
}


// Read network host from .env
let networkHost = '127.0.0.1';
try {
  const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf-8');
  const match = envContent.match(/REACT_APP_NETWORK_HOST\s*=\s*([\d.]+)/);
  if (match) networkHost = match[1];
} catch {}

console.log(`🚀 Starting backend Express server on ${networkHost}:4000...`);
const backend = spawn('npx', ['tsx', 'server/index.js'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, DOTENV_CONFIG_SILENT: 'true', REACT_APP_NETWORK_HOST: networkHost }
});

console.log(`🚀 Starting Vite frontend server on ${networkHost}:3000...`);
const frontend = spawn('npx', ['vite', '--host', networkHost, '--port', '3000'], { stdio: 'inherit', shell: true });

// Handle backend exit
backend.on('exit', (code) => {
  console.log(`❌ Backend server exited with code ${code}`);
});

// Handle frontend exit
frontend.on('exit', (code) => {
  console.log(`❌ Frontend server exited with code ${code}`);
});