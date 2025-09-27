import { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Button, View } from 'react-native';
import ToastView from './ToastView';

const ToastPreview = () => {
  const [show, setShow] = useState(true);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Button title="Show toast" onPress={() => setShow(true)} />
      <ToastView show={show} label="Post saved" onClose={() => setShow(false)} />
    </View>
  );
};

const ToastWithActionPreview = () => {
  const [show, setShow] = useState(true);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Button title="Show toast" onPress={() => setShow(true)} />
      <ToastView
        show={show}
        label="Comment undone"
        onClose={() => setShow(false)}
        actionName="Undo"
        onPress={() => setShow(false)}
      />
    </View>
  );
};

const meta = {
  component: ToastView,
} satisfies Meta<typeof ToastView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <ToastPreview />,
};

export const WithAction: Story = {
  render: () => <ToastWithActionPreview />,
};
