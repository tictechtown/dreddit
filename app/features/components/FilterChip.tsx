import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import useTheme from '../../services/theme/useTheme';
import { Spacing } from '../tokens';

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
          paddingHorizontal: Spacing.s12,
          paddingVertical: Spacing.s8,
          marginRight: Spacing.s12,
        }}>
        <Text style={{ color: theme.onBackground, fontSize: 11 }}>{filterName}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(FilterChip);
