import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import useTheme from '../../services/theme/useTheme';
import { Spacing } from '../typography';

interface Props<T> {
  selected: boolean;
  filterName: string;
  filterType: T;
  onTap: (value: T) => void;
}

const FilterChip = <T extends number>({ selected, filterName, filterType, onTap }: Props<T>) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={() => onTap(filterType)}>
      <View
        style={{
          flex: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected ? theme.surfaceVariant : theme.surface,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.surfaceVariant,
          paddingHorizontal: Spacing.small,
          paddingVertical: Spacing.xsmall,
          marginRight: Spacing.small,
        }}>
        <Text style={{ color: theme.onBackground, fontSize: 11 }}>{filterName}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(FilterChip);
