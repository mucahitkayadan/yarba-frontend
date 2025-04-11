const { override, addBabelPlugins } = require('customize-cra');

// Custom function to override the webpack dev server config
const overrideDevServer = (config) => {
  // Remove deprecated middleware options if they exist
  if (config.onBeforeSetupMiddleware || config.onAfterSetupMiddleware) {
    const onBeforeSetupMiddleware = config.onBeforeSetupMiddleware;
    const onAfterSetupMiddleware = config.onAfterSetupMiddleware;
    
    delete config.onBeforeSetupMiddleware;
    delete config.onAfterSetupMiddleware;
    
    // Add the new setupMiddlewares option
    config.setupMiddlewares = (middlewares, devServer) => {
      if (onBeforeSetupMiddleware) {
        onBeforeSetupMiddleware(devServer);
      }
      
      // Keep the default middlewares
      middlewares.forEach(middleware => devServer.app.use(middleware));
      
      if (onAfterSetupMiddleware) {
        onAfterSetupMiddleware(devServer);
      }
      
      return middlewares;
    };
  }
  
  return config;
};

module.exports = {
  webpack: override(
    ...addBabelPlugins(
      '@babel/plugin-transform-optional-chaining',
      '@babel/plugin-transform-nullish-coalescing-operator',
      '@babel/plugin-transform-numeric-separator',
      '@babel/plugin-transform-private-methods',
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-private-property-in-object'
    )
  ),
  devServer: overrideDevServer
}; 