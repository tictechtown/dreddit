import { Meta, StoryObj } from '@storybook/react-native';
import FeedLoadingIndicator from './FeedLoadingIndicator';
import { View } from 'react-native';
import useTheme from '@services/theme/useTheme';

const meta = {
  component: FeedLoadingIndicator,
  decorators: [
    (Story) => {
      const theme = useTheme();
      return (
        <View
          style={{
            backgroundColor: theme.secondaryContainer,
            flex: 1,
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <Story />
        </View>
      );
    },
  ],
} satisfies Meta<typeof FeedLoadingIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    subreddit: 'soccer',
    icon: undefined,
    onPress: () => {},
  },
};
