#!/usr/bin/env node

/**
 * Custom build script for Vercel deployments
 * This avoids the need for react-app-rewired and customize-cra
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Log environment for debugging
console.log('Build Environment:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- Current working directory:', process.cwd());

// Install required Babel plugins
console.log('Installing Babel plugins...');
try {
  execSync('npm install --no-save @babel/plugin-transform-optional-chaining @babel/plugin-transform-nullish-coalescing-operator @babel/plugin-transform-numeric-separator @babel/plugin-transform-private-methods @babel/plugin-transform-class-properties @babel/plugin-transform-private-property-in-object', 
    { stdio: 'inherit' }
  );
  console.log('Babel plugins installed!');
} catch (error) {
  console.error('Error installing Babel plugins:', error);
  process.exit(1);
}

console.log('Starting build with webpack...');

// Set environment variables
process.env.CI = 'false'; // Prevent treating warnings as errors
process.env.SKIP_PREFLIGHT_CHECK = 'true'; // Skip dependency preflight check

// Run the build command
const buildProcess = spawn('npx', ['react-scripts', 'build'], {
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