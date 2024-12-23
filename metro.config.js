// metro.config.js
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);

// Added this line:
config.resolver.assetExts.push("png");

module.exports = config;

module.exports = wrapWithReanimatedMetroConfig(config);