import { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import CommentItemMediaView from './CommentItemMediaView';
import { mockRedditMedia } from '../../../storybook/mocks';

const meta = {
  component: CommentItemMediaView,
  args: {
    item: mockRedditMedia,
    body: '![gif](media1) Here is a reaction GIF pulled inline with the comment body.',
    showGif: () => {},
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof CommentItemMediaView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AnimatedImage: Story = {};
