import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Palette } from '../colors';
import { Spacing } from '../typography';

interface Props<T> {
  selected: boolean;
  filterName: string;
  filterType: T;
  onTap: (value: T) => void;
}

const FilterChip = <T extends number>({ selected, filterName, filterType, onTap }: Props<T>) => {
  return (
    <TouchableOpacity onPress={() => onTap(filterType)}>
      <View
        style={{
          flex: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected ? Palette.surfaceVariant : Palette.surface,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: Palette.surfaceVariant,
          paddingHorizontal: Spacing.small,
          paddingVertical: Spacing.xsmall,
          marginRight: Spacing.small,
        }}>
        <Text style={{ color: Palette.onBackground, fontSize: 11 }}>{filterName}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(FilterChip);
