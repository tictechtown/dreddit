import { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import IndeterminateProgressBarView from './IndeterminateProgressBarView';

const meta = {
  component: IndeterminateProgressBarView,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof IndeterminateProgressBarView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
