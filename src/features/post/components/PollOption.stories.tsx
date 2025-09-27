import { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import PollOption from './PollOption';

const meta = {
  component: PollOption,
  args: {
    option: { id: '1', text: 'React Native with Expo', vote_count: 420 },
    total: 1000,
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof PollOption>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithVotes: Story = {};

export const WithoutVotes: Story = {
  args: {
    option: { id: '2', text: 'Flutter' },
  },
};
