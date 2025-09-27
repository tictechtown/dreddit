import { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import CommentSpoiler from './CommentSpoiler';

const meta = {
  component: CommentSpoiler,
  args: {
    content: 'Tap to reveal spoiler content about the latest episode.',
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof CommentSpoiler>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
