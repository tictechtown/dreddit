import React from 'react';
import { View } from 'react-native';
import useTheme from '../../services/theme/useTheme';
import Icons from './Icons';
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
      <Icons name="keyboard-arrow-up" size={14} color={theme.onSurface} />

      <Typography variant="labelMedium">{displayedKarma}</Typography>
      <Icons name="keyboard-arrow-down" size={14} color={theme.onSurface} />
    </View>
  );
};

export default PostKarmaButton;
