import { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import PostFeedItemToolbar from './PostFeedItemToolbar';
import { createMockPost, storyTheme } from '../../../../storybook/mocks';

const basePost = createMockPost();

const meta = {
  component: PostFeedItemToolbar,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    post: basePost,
    theme: storyTheme,
    isSaved: false,
    addToSavedPosts: () => {},
    removeFromSavedPosts: () => {},
    onMoreOptions: () => {},
  },
} satisfies Meta<typeof PostFeedItemToolbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Saved: Story = {
  args: {
    isSaved: true,
  },
};

export const WithoutMoreMenu: Story = {
  args: {
    onMoreOptions: undefined,
  },
};
