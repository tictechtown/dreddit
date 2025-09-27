import { Meta, StoryObj } from '@storybook/react-native';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import ProgressBarView from './ProgressBarView';

const ProgressPreview = ({ initialValue }: { initialValue: number }) => {
  const progress = useSharedValue(initialValue);

  useEffect(() => {
    progress.value = initialValue;
  }, [initialValue, progress]);

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
  component: ProgressBarView,
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
  },
  args: {
    value: 0.6,
  },
} satisfies Meta<typeof ProgressBarView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Static: Story = {
  render: ({ value }) => <ProgressPreview initialValue={value as number} />,
};

export const Animated: Story = {
  render: () => <AnimatedProgressPreview />,
};
