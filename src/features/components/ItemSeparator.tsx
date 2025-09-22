import { StyleSheet, View } from 'react-native';
import useTheme from '../../services/theme/useTheme';

const ItemSeparator = ({ fullWidth = false }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        borderBottomColor: theme.outlineVariant,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginHorizontal: fullWidth ? 0 : 16,
      }}
    />
  );
};

export default ItemSeparator;
