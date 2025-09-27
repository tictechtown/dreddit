import { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import SubredditIcon from './SubredditIcon';

const meta = {
  component: SubredditIcon,
  args: {
    size: 72,
    nsfw: false,
    icon: undefined,
  },
  decorators: [
    (Story) => (
      <View style={{ flexDirection: 'row', padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SubredditIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NSFW: Story = {
  args: {
    nsfw: true,
  },
};

export const CustomIcon: Story = {
  args: {
    icon: 'https://styles.redditmedia.com/t5_2qh68/styles/communityIcon_9l1na43r3gc81.png',
  },
};
