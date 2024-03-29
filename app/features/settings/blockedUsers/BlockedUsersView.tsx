import * as React from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useStore } from '../../../services/store';
import useTheme from '../../../services/theme/useTheme';
import { ColorPalette } from '../../colors';
import Icons, { IconName } from '../../components/Icons';
import Typography from '../../components/Typography';

type RowProps = {
  icon: IconName;
  title: string;
  theme: ColorPalette;
  onPress: () => void;
};

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

const BlockedUsersView = () => {
  const theme = useTheme();

  const { blockList, removeFromBlockList } = useStore((state) => ({
    blockList: state.blockedUsers,
    removeFromBlockList: state.removeFromBlockedUsers,
  }));

  const renderItem = React.useCallback(({ item }) => {
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

export default BlockedUsersView;
