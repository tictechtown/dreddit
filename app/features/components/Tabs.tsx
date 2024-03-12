import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import useTheme from '../../services/theme/useTheme';
import { Spacing } from '../typography';
import Typography from './Typography';

type TabProps<T extends string> = {
  tabId: T;
  tabName: string | undefined | null;
  tabIconName: string | undefined | null;
  tabSelectedId: string;
  onPress: (newValue: T) => void;
};

const Tab = <T extends string>({
  tabId,
  tabName,
  tabIconName,
  tabSelectedId,
  onPress,
}: TabProps<T>) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={() => onPress(tabId)}
      disabled={tabSelectedId === tabId}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          columnGap: 4,
          height: '100%',
        }}>
        {!!tabIconName && (
          <MaterialIcons
            // @ts-ignore
            name={tabIconName}
            size={24}
            color={tabSelectedId === tabId ? theme.primary : theme.onSurfaceVariant}
          />
        )}
        <Typography
          variant="titleSmall"
          style={{
            color: tabSelectedId === tabId ? theme.primary : theme.onSurfaceVariant,
          }}>
          {tabName ?? tabId.toUpperCase()}
        </Typography>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: tabSelectedId === tabId ? 3 : 0,
            backgroundColor: theme.primary,
            borderTopStartRadius: 3,
            borderTopEndRadius: 3,
          }}></View>
      </View>
    </TouchableOpacity>
  );
};

type Props = {
  selectedTabId: string;
  tabIds: string[];
  tabNames?: string[];
  tabIconNames?: string[] | null | undefined;
  onPress: (value: string) => void;
};

const Tabs = ({ selectedTabId, tabIds, tabNames, tabIconNames, onPress }: Props) => {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: Spacing.regular,
        backgroundColor: theme.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.surfaceVariant,
      }}>
      {tabIds.map((tabId, idx) => {
        return (
          <Tab
            key={tabId}
            tabId={tabId}
            tabName={tabNames ? tabNames[idx] : null}
            tabIconName={tabIconNames ? tabIconNames[idx] : null}
            tabSelectedId={selectedTabId}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
};

export default Tabs;
