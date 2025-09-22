import * as React from 'react';
import { Pressable, View } from 'react-native';
import useTheme from '../../../../services/theme/useTheme';
import Icons from '../../../../components/Icons';
import Typography from '../../../../components/Typography';

type Props = {
  title: string;
  onPress: () => void;
};

export default function ActionSheetOptionRow({ title, onPress }: Props) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          width: '100%',
          height: 48,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Typography variant="titleMedium">{title}</Typography>
        <Icons name={'radio-button-unchecked'} size={24} color={theme.onSurface} />
      </View>
    </Pressable>
  );
}
