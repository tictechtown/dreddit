import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { Palette } from '../colors';
import Typography from './Typography';

const PostKarmaButton = ({ karma }: { karma: number }) => {
  const displayedKarma =
    karma > 10000 ? `${(karma / 1000).toFixed(1)}k` : karma.toLocaleString('en-US');

  return (
    <View
      style={{
        backgroundColor: Palette.surfaceContainerHigh,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 6,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 4,
      }}>
      <MaterialIcons name="keyboard-arrow-up" size={14} color={Palette.onSurface} />

      <Typography variant="labelMedium">{displayedKarma}</Typography>
      <MaterialIcons name="keyboard-arrow-down" size={14} color={Palette.onSurface} />
    </View>
  );
};

export default PostKarmaButton;
