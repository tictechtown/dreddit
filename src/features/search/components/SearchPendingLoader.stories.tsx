import { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import SearchPendingLoader from './SearchPendingLoader';

const meta = {
  component: SearchPendingLoader,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    query: 'reactnative',
    placeholderCount: 3,
  },
} satisfies Meta<typeof SearchPendingLoader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutQuery: Story = {
  args: {
    query: undefined,
  },
};
