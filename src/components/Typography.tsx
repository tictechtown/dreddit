import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, Text } from 'react-native';
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
    | 'displayLargeEmphasized'
    | 'displayMediumEmphasized'
    | 'displaySmallEmphasized'
    | 'headlineLargeEmphasized'
    | 'headlineMediumEmphasized'
    | 'headlineSmallEmphasized'
    | 'titleLargeEmphasized'
    | 'titleMediumEmphasized'
    | 'titleSmallEmphasized'
    | 'bodyLargeEmphasized'
    | 'bodyMediumEmphasized'
    | 'bodySmallEmphasized'
    | 'labelLargeEmphasized'
    | 'labelMediumEmphasized'
    | 'labelSmallEmphasized'
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
  displayLargeEmphasized: {
    fontSize: 57,
    lineHeight: 64,
    letterSpacing: -0.25,
    fontWeight: '500',
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    letterSpacing: 0,
    fontWeight: '400',
  },
  displayMediumEmphasized: {
    fontSize: 45,
    lineHeight: 52,
    letterSpacing: 0,
    fontWeight: '500',
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 0,
    fontWeight: '400',
  },
  displaySmallEmphasized: {
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 0,
    fontWeight: '500',
  },

  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
    fontWeight: '400',
  },
  headlineLargeEmphasized: {
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
    fontWeight: '500',
  },

  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '400',
  },
  headlineMediumEmphasized: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '500',
  },

  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '400',
  },
  headlineSmallEmphasized: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '500',
  },

  titleLarge: {
    fontSize: 22,
    lineHeight: 24,
    letterSpacing: 0,
    fontWeight: '400',
  },
  titleLargeEmphasized: {
    fontSize: 22,
    lineHeight: 24,
    letterSpacing: 0,
    fontWeight: '500',
  },

  titleMedium: {
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 0.15,
    fontWeight: '500',
  },
  titleMediumEmphasized: {
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 0.15,
    fontWeight: '700',
  },

  titleSmall: {
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.1,
    fontWeight: '500',
  },
  titleSmallEmphasized: {
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.1,
    fontWeight: '700',
  },

  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    fontWeight: '400',
  },
  bodyLargeEmphasized: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    fontWeight: '500',
  },

  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    fontWeight: '400',
  },
  bodyMediumEmphasized: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    fontWeight: '500',
  },

  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
    fontWeight: '400',
  },
  bodySmallEmphasized: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
    fontWeight: '500',
  },

  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '500',
  },
  labelLargeEmphasized: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '700',
  },

  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  labelMediumEmphasized: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '700',
  },

  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  labelSmallEmphasized: {
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '700',
  },

  overline: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
});
