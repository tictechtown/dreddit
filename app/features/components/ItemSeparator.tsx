import { StyleSheet, View } from 'react-native';
import { Palette } from '../colors';

const ItemSeparator = () => {
  return (
    <View
      style={{
        borderBottomColor: Palette.onBackgroundLowest,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 8,
      }}
    />
  );
};

export default ItemSeparator;
