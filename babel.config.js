module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript"
  ],
  plugins: [
    "@babel/plugin-transform-optional-chaining",
    "@babel/plugin-transform-nullish-coalescing-operator",
    "@babel/plugin-transform-numeric-separator",
    "@babel/plugin-transform-private-methods",
    "@babel/plugin-transform-class-properties",
    "@babel/plugin-transform-private-property-in-object"
  ]
}; 