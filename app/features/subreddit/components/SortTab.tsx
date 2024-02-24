import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Palette } from '../../colors';
import { Spacing } from '../../typography';

type Props = {
  tabId: 'hot' | 'top' | 'new';
  tabIconName: string;
  tabSelectedId: string;
  onPress: (newValue: 'hot' | 'top' | 'new') => void;
};

const SortTab = ({ tabId, tabIconName, tabSelectedId, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: Spacing.xsmall,
        borderBottomWidth: tabSelectedId === tabId ? 2 : 0,
        borderBottomColor: Palette.primary,
        flexDirection: 'row',
      }}
      onPress={() => onPress(tabId)}
      disabled={tabSelectedId === tabId}>
      <>
        <MaterialIcons
          name={tabIconName}
          size={24}
          style={{ marginRight: 4 }}
          color={tabSelectedId === tabId ? Palette.primary : Palette.onBackgroundLowest}
        />
        <Text
          style={{
            fontSize: 12,
            fontWeight: 'bold',
            color: tabSelectedId === tabId ? Palette.primary : Palette.onBackgroundLowest,
          }}>
          {tabId.toUpperCase()}
        </Text>
      </>
    </TouchableOpacity>
  );
};

export default SortTab;
