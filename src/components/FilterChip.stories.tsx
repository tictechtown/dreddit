import { Meta, StoryObj } from '@storybook/react-native';
import FilterChip from './FilterChip';
import { View } from 'react-native';

const meta = {
  component: FilterChip,
  decorators: [
    (Story) => (
      <View style={{ flexDirection: 'row', padding: 24 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof FilterChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    value: 'First Name',
    onChange: () => {},
  },
};
