import { useColorScheme } from 'react-native';
import { useStore } from '../store';

export default () => {
  const colorScheme = useColorScheme();
  const storedValue = useStore((state) => state.colorScheme);
  if (storedValue === 'os') {
    return colorScheme ?? 'light';
  }
  return storedValue;
};
