import React from 'react';
import { Pressable, View } from 'react-native';
import useTheme from '@services/theme/useTheme';
import Icons from './Icons';
import Typography from './Typography';

export default function FilterChip(props: { value: string; onChange: () => void }) {
  const theme = useTheme();

  return (
    <Pressable onPress={props.onChange} style={{ flexDirection: 'row', flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          borderRadius: 8,
          flex: 1,
          backgroundColor: theme.secondaryContainer,
          paddingLeft: 12,
          paddingVertical: 6,
          paddingRight: 4,
          columnGap: 2,
          alignItems: 'center',
        }}>
        <Typography
          variant="bodyMedium"
          style={{ fontWeight: 'bold', color: theme.onSurfaceVariant }}>
          {props.value}
        </Typography>
        <Icons name="arrow-drop-down" color={theme.onSurfaceVariant} size={18} />
      </View>
    </Pressable>
  );
}
