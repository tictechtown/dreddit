import { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import Icons from './Icons';

const meta = {
  component: Icons,
  args: {
    name: 'favorite',
    size: 32,
    color: '#e91e63',
  },
} satisfies Meta<typeof Icons>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Gallery: Story = {
  render: (args) => (
    <View style={{ flexDirection: 'row', columnGap: 12 }}>
      <Icons {...args} name="favorite" color="#e91e63" />
      <Icons {...args} name="chat-bubble" color="#2196f3" />
      <Icons {...args} name="thumb-up" color="#4caf50" />
      <Icons {...args} name="warning" color="#ff9800" />
    </View>
  ),
};
