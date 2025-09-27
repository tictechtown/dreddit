import { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import HomeItem from './HomeItem';

const meta = {
  component: HomeItem,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, maxWidth: 360 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    subreddit: 'reactnative',
    description: 'Discussions, tutorials, and showcases about building apps with React Native.',
    onIconNotFoundError: () => {},
  },
} satisfies Meta<typeof HomeItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    subreddit: 'something',
    icon: undefined,
    description: 'Discussions, tutorials, and showcases about building apps with React Native.',
    onIconNotFoundError: () => {},
  },
};

export const WithoutIcon: Story = {
  args: {
    icon: undefined,
  },
};
