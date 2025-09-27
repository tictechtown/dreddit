import { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import Tabs from './Tabs';

const meta = {
  component: Tabs,
  args: {
    selectedTabId: 'hot',
    tabIds: ['hot', 'new', 'top'],
    tabNames: ['Hot', 'New', 'Top'],
    tabIconNames: ['whatshot', 'new-releases', 'star'],
    onPress: (_value: string | number) => {},
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => {
    const [selectedTab, setSelectedTab] = useState(args.selectedTabId);
    return (
      <View style={{ paddingVertical: 24 }}>
        <Tabs
          {...args}
          selectedTabId={selectedTab}
          onPress={(value) => {
            setSelectedTab(value);
            args.onPress(value);
          }}
        />
      </View>
    );
  },
};

export const WithoutIcons: Story = {
  args: {
    selectedTabId: 0,
    tabIds: [0, 1, 2, 3],
    tabNames: ['Posts', 'Comments', 'Saved', 'Hidden'],
    tabIconNames: undefined,
  },
  render: (args) => {
    const [selectedTab, setSelectedTab] = useState(args.selectedTabId);
    return (
      <View style={{ paddingVertical: 24 }}>
        <Tabs
          {...args}
          selectedTabId={selectedTab}
          onPress={(value) => {
            setSelectedTab(value);
            args.onPress(value);
          }}
        />
      </View>
    );
  },
};
