import { Meta, StoryObj } from '@storybook/react-native';
import FeedLoadingIndicator from './FeedLoadingIndicator';
import { View } from 'react-native';

const meta = {
  component: FeedLoadingIndicator,
  decorators: [
    (Story) => {
      return (
        <View
          style={{
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
