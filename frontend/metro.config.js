const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable CommonJS (.cjs), ES Module (.mjs), and package exports resolution for Firebase in Metro bundler
config.resolver.sourceExts.push('cjs', 'mjs');
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
