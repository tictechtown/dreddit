import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, useColorScheme } from 'react-native';
import Home from './features/home';

export default function Page() {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      <Home />
      <StatusBar style={colorScheme === 'dark' ? 'dark' : 'light'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
