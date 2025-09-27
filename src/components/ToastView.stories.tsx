import { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Button, View } from 'react-native';
import ToastView from './ToastView';

const meta = {
  component: ToastView,
  args: {
    show: true,
    label: 'Post saved',
    onClose: () => {},
  },
} satisfies Meta<typeof ToastView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => {
    const [show, setShow] = useState(args.show);
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <Button title="Show toast" onPress={() => setShow(true)} />
        <ToastView
          {...args}
          show={show}
          onClose={() => {
            setShow(false);
            args.onClose();
          }}
        />
      </View>
    );
  },
};

export const WithAction: Story = {
  args: {
    label: 'Comment undone',
    actionName: 'Undo',
    onPress: () => {},
  },
  render: (args) => {
    const [show, setShow] = useState(args.show);
    const actionHandler =
      'onPress' in args
        ? () => {
            args.onPress();
            setShow(false);
          }
        : undefined;
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <Button title="Show toast" onPress={() => setShow(true)} />
        <ToastView
          {...args}
          show={show}
          onPress={actionHandler}
          onClose={() => {
            setShow(false);
            args.onClose();
          }}
        />
      </View>
    );
  },
};
