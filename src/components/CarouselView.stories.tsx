import { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import CarouselView from './CarouselView';

const SAMPLE_RESOLUTIONS = [
  {
    x: 1200,
    y: 900,
    u: 'https://picsum.photos/id/1015/1200/900',
  },
  {
    x: 1200,
    y: 900,
    u: 'https://picsum.photos/id/1025/1200/900',
  },
  {
    x: 1200,
    y: 900,
    u: 'https://picsum.photos/id/1044/1200/900',
  },
];

const meta = {
  component: CarouselView,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    width: 320,
    resolutions: SAMPLE_RESOLUTIONS,
    captions: ['Mountain view', 'Puppy portrait', 'Snowy forest'],
  },
} satisfies Meta<typeof CarouselView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
