import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Palette } from './features/colors';
import Home from './features/home';

export default function Page() {
  return (
    <View style={styles.container}>
      <Home />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.backgroundLowest,
  },
});
