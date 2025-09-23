import { Stack } from 'expo-router';
import * as React from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useStore } from '@services/store';
import useTheme from '@services/theme/useTheme';
import type { ColorPalette } from '@theme/colors';
import type { IconName } from '@components/Icons';
import Icons from '@components/Icons';
import Typography from '@components/Typography';

interface RowProps {
  icon: IconName;
  title: string;
  theme: ColorPalette;
  onPress: () => void;
}

const Row = ({ icon, title, theme, onPress }: RowProps) => {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          minHeight: 56,
          paddingVertical: 8,
          paddingLeft: 16,
          paddingRight: 24,
          flexDirection: 'row',
          columnGap: 16,
          alignItems: 'center',
        }}>
        <Icons name={icon} size={24} color={theme.onSurfaceVariant} />
        <View style={{ flex: 1 }}>
          <Typography variant="bodyLarge">{title}</Typography>
        </View>
        <Icons name={'block'} size={24} color={theme.onSurface} />
      </View>
    </Pressable>
  );
};

const BannedSubredditsView = () => {
  const theme = useTheme();

  const { blockList, removeFromBlockList } = useStore((state) => ({
    blockList: state.blockedSubreddits,
    removeFromBlockList: state.removeFromBlockedSubreddits,
  }));

  const renderItem = React.useCallback(({ item }: { item: string }) => {
    return (
      <Row
        icon="person"
        title={item}
        theme={theme}
        onPress={() => {
          removeFromBlockList(item);
        }}
      />
    );
  }, []);

  return (
    <View style={{ backgroundColor: theme.background }}>
      <FlatList data={blockList} renderItem={renderItem} />
    </View>
  );
};

export default function Page() {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.surface,
      }}>
      <Stack.Screen options={{ title: 'Banned Subreddits' }} />
      <BannedSubredditsView />
    </View>
  );
}
