#!/usr/bin/env node

/**
 * Custom build script for Vercel deployments
 * This ensures react-app-rewired is available during the build process
 */

const { spawn, execSync } = require('child_process');

// Log environment for debugging
console.log('Build Environment:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- Current working directory:', process.cwd());
console.log('- Files in directory:', execSync('ls -la').toString());
console.log('- Files in node_modules:', execSync('ls -la node_modules || echo "No node_modules directory"').toString());

// Make sure dependencies are installed
console.log('Installing build dependencies...');
try {
  // Directly install the required packages
  execSync('npm install react-app-rewired customize-cra --no-save', { stdio: 'inherit' });
  console.log('Dependencies installed!');
  
  // Verify installation
  console.log('Verifying installation:');
  console.log('- Files in node_modules/.bin:', execSync('ls -la node_modules/.bin || echo "Directory not found"').toString());
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}

console.log('Starting build with react-app-rewired...');

// Run the build command (using npx to ensure it's found)
const buildProcess = spawn('npx', ['react-app-rewired', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

// Handle process completion
buildProcess.on('close', (code) => {
  console.log(`Build process exited with code ${code}`);
  process.exit(code);
});

// Handle process errors
buildProcess.on('error', (err) => {
  console.error('Failed to start build process:', err);
  process.exit(1);
}); 