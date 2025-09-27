import { Meta, StoryObj } from '@storybook/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import ImageZoom from './index';

const meta = {
  component: ImageZoom,
  args: {
    uri: 'https://picsum.photos/seed/storybook-zoom/1200/800',
    maxScale: 3,
    minScale: 1,
  },
  decorators: [
    (Story) => (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, height: 400, backgroundColor: '#000' }}>
          <Story />
        </View>
      </GestureHandlerRootView>
    ),
  ],
} satisfies Meta<typeof ImageZoom>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const LimitedPan: Story = {
  args: {
    maxPanPointers: 1,
    isPanEnabled: true,
    isPinchEnabled: true,
  },
};
