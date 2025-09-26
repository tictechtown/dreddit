// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const withStorybook = require('@storybook/react-native/metro/withStorybook');
/** withStorybook Adds the config that storybook uses */
module.exports = withStorybook(config);
