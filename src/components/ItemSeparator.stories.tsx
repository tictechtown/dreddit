import { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import ItemSeparator from './ItemSeparator';

const meta = {
  component: ItemSeparator,
  args: {
    fullWidth: false,
  },
  decorators: [
    (Story, context) => (
      <View style={{ paddingVertical: 24 }}>
        <View style={{ height: 24, justifyContent: 'center' }}>
          <Story {...context} />
        </View>
      </View>
    ),
  ],
} satisfies Meta<typeof ItemSeparator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
  },
};
