import { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import PostKarmaButton from './PostKarmaButton';

const meta = {
  component: PostKarmaButton,
  args: {
    karma: 12894,
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof PostKarmaButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const LargeKarma: Story = {
  args: {
    karma: 215467,
  },
};
