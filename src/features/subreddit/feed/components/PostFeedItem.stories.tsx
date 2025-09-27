import { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import PostFeedItem from './PostFeedItem';
import { createMockPost, mockRedditMedia, storyTheme } from '../../../../storybook/mocks';

const basePost = createMockPost();

const galleryMetadata = {
  media1: {
    ...mockRedditMedia,
    e: 'Image',
    t: undefined,
    s: {
      x: 1280,
      y: 720,
      u: 'https://picsum.photos/seed/feed-gallery-1/1280/720',
    },
    p: [
      { x: 320, y: 180, u: 'https://picsum.photos/seed/feed-gallery-1/320/180' },
      { x: 640, y: 360, u: 'https://picsum.photos/seed/feed-gallery-1/640/360' },
      { x: 960, y: 540, u: 'https://picsum.photos/seed/feed-gallery-1/960/540' },
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
      u: 'https://picsum.photos/seed/feed-gallery-2/1280/720',
    },
    p: [
      { x: 320, y: 180, u: 'https://picsum.photos/seed/feed-gallery-2/320/180' },
      { x: 640, y: 360, u: 'https://picsum.photos/seed/feed-gallery-2/640/360' },
      { x: 960, y: 540, u: 'https://picsum.photos/seed/feed-gallery-2/960/540' },
    ],
  },
};

const galleryPost = createMockPost({
  is_gallery: true,
  gallery_data: {
    items: [
      { media_id: 'media1', id: '1', caption: 'Workspace' },
      { media_id: 'media2', id: '2', caption: 'UI preview' },
    ],
  },
  media_metadata: galleryMetadata,
});

const meta = {
  component: PostFeedItem,
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
} satisfies Meta<typeof PostFeedItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Saved: Story = {
  args: {
    isSaved: true,
  },
};

export const Gallery: Story = {
  args: {
    post: galleryPost,
  },
};
