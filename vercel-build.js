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

// Make sure dependencies are installed
console.log('Ensuring build dependencies are installed...');
try {
  // Install required packages if not already installed
  execSync('npm list customize-cra || npm install customize-cra --no-save', { stdio: 'inherit' });
  execSync('npm list react-app-rewired || npm install react-app-rewired --no-save', { stdio: 'inherit' });
  console.log('Dependencies verified!');
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}

console.log('Starting build with react-app-rewired...');

// Run the build command (using local node_modules)
const buildProcess = spawn('./node_modules/.bin/react-app-rewired', ['build'], {
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