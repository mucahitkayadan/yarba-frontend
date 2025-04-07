#!/usr/bin/env node

/**
 * Custom build script for Vercel deployments
 * This ensures react-app-rewired is available during the build process
 */

const { spawn } = require('child_process');

// Log environment for debugging
console.log('Build Environment:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- Current working directory:', process.cwd());

console.log('Starting build with npx react-app-rewired...');

// Run the build command using npx to ensure it finds the package
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