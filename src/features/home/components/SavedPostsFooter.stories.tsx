import { Meta, StoryObj } from '@storybook/react-native';
import { useEffect } from 'react';
import SavedPostsFooter from './SavedPostsFooter';
import { useStore } from '@services/store';

const SavedPostsFooterPreview = ({ count }: { count: number }) => {
  useEffect(() => {
    useStore.setState({
      savedPosts: Array.from({ length: count }, (_, index) => ({
        kind: 't3',
        data: { id: `saved-${index}` },
      })),
    });

    return () => {
      useStore.setState({ savedPosts: [] });
    };
  }, [count]);

  return <SavedPostsFooter />;
};

const meta = {
  component: SavedPostsFooterPreview,
  args: {
    count: 8,
  },
} satisfies Meta<typeof SavedPostsFooterPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithSavedPosts: Story = {};

export const EmptyState: Story = {
  args: {
    count: 0,
  },
};
