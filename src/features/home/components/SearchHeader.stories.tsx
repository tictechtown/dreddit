import { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import SearchHeader from './SearchHeader';

const meta = {
  component: SearchHeader,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SearchHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
