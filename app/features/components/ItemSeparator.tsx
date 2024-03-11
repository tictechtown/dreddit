import { StyleSheet, View } from 'react-native';
import { Palette } from '../colors';

const ItemSeparator = ({ fullWidth = false }) => {
  return (
    <View
      style={{
        borderBottomColor: Palette.outlineVariant,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginHorizontal: fullWidth ? 0 : 16,
      }}
    />
  );
};

export default ItemSeparator;
