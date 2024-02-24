import { Stack } from 'expo-router';
import { ScrollView, Switch, Text, View } from 'react-native';
import { useStore } from '../../services/store';
import { Palette } from '../colors';
import { Spacing } from '../typography';

const Page = () => {
  const [useLowRes, setUseLowRes] = useStore((state) => [state.useLowRes, state.setUseLowRes]);

  return (
    <View>
      <Stack.Screen options={{ title: 'Settings' }} />
      <ScrollView style={{ width: '100%' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: Spacing.regular,
          }}>
          <Text style={{ color: Palette.onBackground, flex: 1, fontSize: 20 }}>Low Data Mode</Text>
          <Switch value={useLowRes} onValueChange={setUseLowRes} thumbColor={Palette.secondary} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: Spacing.regular,
          }}>
          <Text style={{ color: Palette.onBackground, flex: 1, fontSize: 20 }}>
            Light Mode/Dark Mode
          </Text>
          <Switch value={true} onValueChange={setUseLowRes} thumbColor={Palette.secondary} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Page;
