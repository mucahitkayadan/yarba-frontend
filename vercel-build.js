#!/usr/bin/env node

/**
 * Custom build script for Vercel deployments
 * This ensures react-app-rewired is available during the build process
 */

const { spawn } = require('child_process');
const path = require('path');

// Path to node_modules/.bin where react-app-rewired should be located
const binPath = path.resolve(__dirname, 'node_modules', '.bin');

// Log environment for debugging
console.log('Build Environment:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- Path to bin directory:', binPath);
console.log('- Current working directory:', process.cwd());

// Add the bin directory to PATH
process.env.PATH = `${binPath}:${process.env.PATH}`;

console.log('Starting build with react-app-rewired...');

// Run the build command
const buildProcess = spawn('react-app-rewired', ['build'], {
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