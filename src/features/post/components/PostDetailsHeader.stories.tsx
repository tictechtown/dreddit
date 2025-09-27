import { Meta, StoryObj } from '@storybook/react-native';
import type { ComponentProps } from 'react';
import PostDetailsHeader from './PostDetailsHeader';
import { createMockPost, mockRedditMedia, storyTheme } from '../../../storybook/mocks';

type ComponentArgs = ComponentProps<typeof PostDetailsHeader>;

const basePost = createMockPost();

const pollPost = createMockPost({
  poll_data: {
    voting_end_timestamp: Date.now() + 1000 * 60 * 60 * 24,
    total_vote_count: 1242,
    options: [
      { id: 'opt-1', text: 'React Native', vote_count: 720 },
      { id: 'opt-2', text: 'Flutter', vote_count: 380 },
      { id: 'opt-3', text: 'SwiftUI', vote_count: 142 },
    ],
  },
});

const galleryMetadata = {
  media1: {
    ...mockRedditMedia,
    e: 'Image',
    t: undefined,
    s: {
      x: 1280,
      y: 720,
      u: 'https://picsum.photos/seed/gallery-1/1280/720',
    },
    p: [
      { x: 320, y: 180, u: 'https://picsum.photos/seed/gallery-1/320/180' },
      { x: 640, y: 360, u: 'https://picsum.photos/seed/gallery-1/640/360' },
      { x: 960, y: 540, u: 'https://picsum.photos/seed/gallery-1/960/540' },
    ],
  },
  media2: {
    ...mockRedditMedia,
    id: 'media2',
    e: 'Image',
    t: undefined,
    s: {
      x: 1280,
      y: 720,
      u: 'https://picsum.photos/seed/gallery-2/1280/720',
    },
    p: [
      { x: 320, y: 180, u: 'https://picsum.photos/seed/gallery-2/320/180' },
      { x: 640, y: 360, u: 'https://picsum.photos/seed/gallery-2/640/360' },
      { x: 960, y: 540, u: 'https://picsum.photos/seed/gallery-2/960/540' },
    ],
  },
};

const galleryPost = createMockPost({
  is_gallery: true,
  gallery_data: {
    items: [
      { media_id: 'media1', id: '1', caption: 'Studio setup' },
      { media_id: 'media2', id: '2', caption: 'Dark mode preview' },
    ],
  },
  media_metadata: galleryMetadata,
});

const meta = {
  component: PostDetailsHeader,
  args: {
    post: basePost,
    forcedSortOrder: undefined,
    onMediaPress: () => {},
    onChangeSort: () => {},
    theme: storyTheme,
  } satisfies ComponentArgs,
} satisfies Meta<typeof PostDetailsHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithPoll: Story = {
  args: {
    post: pollPost,
    forcedSortOrder: 'top',
  },
};

export const Gallery: Story = {
  args: {
    post: galleryPost,
  },
};
