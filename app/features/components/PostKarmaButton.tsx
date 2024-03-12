import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import useTheme from '../../services/theme/useTheme';
import Typography from './Typography';

const PostKarmaButton = ({ karma }: { karma: number }) => {
  const theme = useTheme();
  const displayedKarma =
    karma > 10000 ? `${(karma / 1000).toFixed(1)}k` : karma.toLocaleString('en-US');

  return (
    <View
      style={{
        backgroundColor: theme.surfaceContainerHigh,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 6,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 4,
      }}>
      <MaterialIcons name="keyboard-arrow-up" size={14} color={theme.onSurface} />

      <Typography variant="labelMedium">{displayedKarma}</Typography>
      <MaterialIcons name="keyboard-arrow-down" size={14} color={theme.onSurface} />
    </View>
  );
};

export default PostKarmaButton;
