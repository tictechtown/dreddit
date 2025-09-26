import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: [
    './stories/**/*.stories.?(ts|tsx|js|jsx)',
    // the paths are relative to the main.ts file itself
    '../src/**/*.stories.?(ts|tsx|js|jsx)', // <--- Add this
  ],

  addons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
};

export default main;
