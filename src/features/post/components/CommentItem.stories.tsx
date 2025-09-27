import { Meta, StoryObj } from '@storybook/react-native';
import type { ComponentProps } from 'react';
import { View } from 'react-native';
import type { Comment } from '@services/api';
import CommentItem from './CommentItem';
import { createMockComment, mockRedditMedia, storyTheme } from '../../../storybook/mocks';

type CommentArgs = ComponentProps<typeof CommentItem>;

const baseComment = createMockComment();

const mediaComment = createMockComment({
  media_metadata: {
    media1: mockRedditMedia,
  },
  body: `${baseComment.data.body}\n\n![gif](media1)`,
});

const autoModeratorComment = createMockComment({
  author: 'AutoModerator',
  author_flair_text: null,
  author_flair_richtext: [],
  stickied: true,
  distinguished: 'moderator',
  body: 'Please keep the discussion civil. This message will toggle moderation notes when tapped.',
});

const moreComment: Comment = {
  kind: 'more',
  data: {
    count: 5,
    name: 'more_children',
    id: 'more1',
    parent_id: baseComment.data.id,
    depth: 1,
    children: ['child1', 'child2', 'child3'],
  },
};

const meta = {
  component: CommentItem,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, gap: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    comment: baseComment,
    fetchMoreComments: () => {},
    showGif: () => {},
    theme: storyTheme,
  } satisfies CommentArgs,
} satisfies Meta<typeof CommentItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithMedia: Story = {
  args: {
    comment: mediaComment,
  },
};

export const AutoModerator: Story = {
  args: {
    comment: autoModeratorComment,
  },
};

export const LoadMore: Story = {
  args: {
    comment: moreComment,
  },
};
