import { Meta, StoryObj } from '@storybook/react-native';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import ProgressBarView from './ProgressBarView';

const ProgressStory = ({ value }: { value: number }) => {
  const progress = useSharedValue(value);

  useEffect(() => {
    progress.value = value;
  }, [value, progress]);

  return (
    <View style={{ padding: 16 }}>
      <ProgressBarView progress={progress} />
    </View>
  );
};

const AnimatedProgressPreview = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 2000 }), -1, false);
  }, [progress]);

  return (
    <View style={{ padding: 16 }}>
      <ProgressBarView progress={progress} />
    </View>
  );
};

const meta = {
  component: ProgressStory,
  args: {
    value: 0.6,
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
  },
} satisfies Meta<typeof ProgressStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Static: Story = {};

export const Animated: Story = {
  args: {
    value: 0.6,
  },
  render: () => <AnimatedProgressPreview />,
};
