// This is a temporary webpack config for Vercel deployment
const path = require('path');
const fs = require('fs');

// Get Create React App's webpack config
const getCraWebpackConfig = () => {
  const craConfig = require('react-scripts/config/webpack.config');
  
  // Call the function if it's a function (handles both CRA v3 and v4+)
  return typeof craConfig === 'function' ? craConfig('production') : craConfig;
};

// Add our custom Babel plugins
module.exports = () => {
  // Get the base config
  const config = getCraWebpackConfig();
  
  // Find the babel-loader rule
  const babelLoaderRule = config.module.rules
    .find(rule => rule.oneOf)
    .oneOf.find(rule => 
      rule.loader && 
      rule.loader.indexOf('babel-loader') !== -1 &&
      rule.options &&
      rule.options.babelrc === false
    );
  
  // If found, add our plugins
  if (babelLoaderRule) {
    babelLoaderRule.options.plugins = [
      ...(babelLoaderRule.options.plugins || []),
      '@babel/plugin-transform-optional-chaining',
      '@babel/plugin-transform-nullish-coalescing-operator',
      '@babel/plugin-transform-numeric-separator',
      '@babel/plugin-transform-private-methods',
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-private-property-in-object'
    ];
  }
  
  return config;
}; 