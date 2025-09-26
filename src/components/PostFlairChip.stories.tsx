import { Meta, StoryObj } from '@storybook/react-native';
import PostFlairChip from './PostFlairChip';
import { View } from 'react-native';
import useTheme from '@services/theme/useTheme';

const meta = {
  component: PostFlairChip,
  decorators: [
    (Story, context) => {
      const theme = useTheme();
      Object.assign(context.args, { theme });
      return (
        <View
          style={{
            flexDirection: 'row',
            padding: 24,
            backgroundColor: theme.background,
            height: '100%',
          }}>
          {Story(context)}
        </View>
      );
    },
  ],
} satisfies Meta<typeof PostFlairChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  // @ts-ignore
  args: {
    flair_text: 'Flair Text',
    outlined: true,
  },
};

export const Sticky: Story = {
  // @ts-ignore
  args: {
    flair_text: 'Flair Text',
    stickied: true,
  },
};

export const Pinned: Story = {
  // @ts-ignore
  args: {
    flair_text: 'Flair Text',
    pinned: true,
  },
};
