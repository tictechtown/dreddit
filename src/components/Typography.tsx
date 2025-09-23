import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import useTheme from '@services/theme/useTheme';

type Props = React.ComponentProps<typeof Text> & {
  variant:
    | 'displayLarge'
    | 'displayMedium'
    | 'displaySmall'
    | 'headlineLarge'
    | 'headlineMedium'
    | 'headlineSmall'
    | 'titleLarge'
    | 'titleMedium'
    | 'titleSmall'
    | 'bodyLarge'
    | 'bodyMedium'
    | 'bodySmall'
    | 'labelLarge'
    | 'labelMedium'
    | 'labelSmall'
    | 'overline';
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export default (props: Props) => {
  const { style, children, variant, ...rest } = props;

  const theme = useTheme();

  return (
    // @ts-ignore
    <Text style={[styles.text, { color: theme.onSurface }, styles[variant], style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },

  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    letterSpacing: -0.25,
    fontWeight: '400',
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    letterSpacing: 0,
    fontWeight: '400',
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 0,
    fontWeight: '400',
  },

  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
    fontWeight: '400',
  },

  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '400',
  },
  titleLarge: {
    fontSize: 22,
    lineHeight: 24,
    letterSpacing: 0,
    fontWeight: '400',
  },

  titleMedium: {
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 0.15,
    fontWeight: '500',
  },

  titleSmall: {
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.1,
    fontWeight: '500',
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    fontWeight: '400',
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
    fontWeight: '400',
  },

  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '500',
  },

  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '500',
  },

  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  overline: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
});
