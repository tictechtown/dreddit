import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Text, TouchableNativeFeedback, View } from 'react-native';
import { Palette } from '../../colors';
import { Spacing } from '../../typography';

const SearchHeader = () => {
  return (
    <TouchableNativeFeedback
      style={{ flex: 1 }}
      background={TouchableNativeFeedback.Ripple(Palette.surfaceVariant, false)}
      onPress={() => {
        router.push('features/search');
      }}>
      <View
        style={{
          height: 48,
          marginHorizontal: Spacing.small,
          paddingHorizontal: Spacing.regular,
          borderRadius: 32,
          backgroundColor: Palette.background,
          alignItems: 'center',
          marginBottom: Spacing.regular,
          flexDirection: 'row',
        }}>
        <Ionicons name="search" size={20} color={Palette.onBackground} />

        <Text
          style={{
            marginLeft: Spacing.small,
            fontSize: 20,
            color: Palette.onBackground,
          }}>
          Search Reddit
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};

export default SearchHeader;
