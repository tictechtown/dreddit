import { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import Tabs from './Tabs';

const TabsPreview = () => {
  const [selectedTab, setSelectedTab] = useState<'hot' | 'new' | 'top'>('hot');

  return (
    <View style={{ paddingVertical: 24 }}>
      <Tabs
        selectedTabId={selectedTab}
        tabIds={['hot', 'new', 'top']}
        tabNames={['Hot', 'New', 'Top']}
        tabIconNames={['whatshot', 'new-releases', 'star']}
        onPress={setSelectedTab}
      />
    </View>
  );
};

const meta = {
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <TabsPreview />,
};

export const WithoutIcons: Story = {
  render: () => {
    const [selectedTab, setSelectedTab] = useState(0);
    return (
      <View style={{ paddingVertical: 24 }}>
        <Tabs
          selectedTabId={selectedTab}
          tabIds={[0, 1, 2, 3]}
          tabNames={['Posts', 'Comments', 'Saved', 'Hidden']}
          onPress={setSelectedTab}
        />
      </View>
    );
  },
};
