import type { Preview } from '@storybook/react';
import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import useTheme from '../src/services/theme/useTheme';
import { ThemeContext } from '../src/services/theme/theme';
import { PaletteDark } from '../src/theme/colors';

const ThemeBackground = ({ children }: PropsWithChildren) => {
  const theme = useTheme();
  return <View style={{ flex: 1, backgroundColor: theme.background }}>{children}</View>;
};

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeContext.Provider value={PaletteDark}>
        <ThemeBackground>
          <Story />
        </ThemeBackground>
      </ThemeContext.Provider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
