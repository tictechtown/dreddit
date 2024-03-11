import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Palette } from '../colors';
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
            color={tabSelectedId === tabId ? Palette.primary : Palette.onSurfaceVariant}
          />
        )}
        <Typography
          variant="titleSmall"
          style={{
            color: tabSelectedId === tabId ? Palette.primary : Palette.onSurfaceVariant,
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
            backgroundColor: Palette.primary,
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
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: Spacing.regular,
        backgroundColor: Palette.surface,
        borderBottomWidth: 1,
        borderBottomColor: Palette.surfaceVariant,
      }}>
      {tabIds.map((tabId, idx) => {
        return (
          <Tab
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
