import { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import PostContentPreview from './PostContentPreview';
import { createMockPost, storyTheme } from '../../../../storybook/mocks';

const imagePost = createMockPost();

const youtubePost = createMockPost({
  domain: 'youtube.com',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  preview: undefined,
  media: null,
  is_video: true,
});

const articlePost = createMockPost({
  domain: 'reactnative.dev',
  url: 'https://reactnative.dev/blog',
  preview: {
    images: [
      {
        source: {
          url: 'https://picsum.photos/seed/article/600/360',
          width: 600,
          height: 360,
        },
        resolutions: [
          { url: 'https://picsum.photos/seed/article/80/80', width: 80, height: 80 },
          { url: 'https://picsum.photos/seed/article/120/120', width: 120, height: 120 },
        ],
        id: 'article-preview',
      },
    ],
    enabled: false,
  },
});

const noPreviewPost = createMockPost({
  domain: 'github.com',
  url: 'https://github.com/expo/expo',
  preview: undefined,
});

const meta = {
  component: PostContentPreview,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    post: imagePost,
    imageWidth: 320,
    theme: storyTheme,
  },
} satisfies Meta<typeof PostContentPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Image: Story = {};

export const Youtube: Story = {
  args: {
    post: youtubePost,
  },
};

export const Article: Story = {
  args: {
    post: articlePost,
  },
};

export const NoPreview: Story = {
  args: {
    post: noPreviewPost,
  },
};
