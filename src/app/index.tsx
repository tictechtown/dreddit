import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import HomePage from './home';

export default function Page() {
  return (
    <View style={styles.container}>
      <HomePage />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
