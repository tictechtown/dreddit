import React, { useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, Animated, Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Typography from '@components/Typography';
import useTheme from '@services/theme/useTheme';
import { Spacing } from '@theme/tokens';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const windowWidth = Dimensions.get('window').width;

type SearchPendingLoaderProps = {
  query?: string;
  placeholderCount?: number;
  searchType?: 'subreddits' | 'posts' | 'users';
};

function hexToRgba(hex: string, alpha: number): string {
  if (!hex.startsWith('#')) {
    return hex;
  }

  let raw = hex.replace('#', '');
  if (raw.length === 3) {
    raw = raw
      .split('')
      .map((char) => `${char}${char}`)
      .join('');
  }

  const trimmed = raw.slice(0, 6);
  const numeric = parseInt(trimmed, 16);
  const r = (numeric >> 16) & 255;
  const g = (numeric >> 8) & 255;
  const b = numeric & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const shimmerStyle = (animation: Animated.Value) => ({
  transform: [
    {
      translateX: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-windowWidth, windowWidth],
      }),
    },
  ],
});

const SearchPendingLoader = ({
  query,
  placeholderCount = 3,
  searchType,
}: SearchPendingLoaderProps) => {
  const theme = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      }),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [shimmer]);

  const highlightColor = useMemo(() => hexToRgba(theme.primary, 0.18), [theme.primary]);

  const surfaceStroke = useMemo(
    () => hexToRgba(theme.outlineVariant, 0.35),
    [theme.outlineVariant],
  );

  const surfaceMuted = useMemo(
    () => hexToRgba(theme.surfaceContainerHighest, 0.85),
    [theme.surfaceContainerHighest],
  );

  const placeholders = useMemo(
    () => Array.from({ length: Math.max(1, placeholderCount) }, (_, index) => index),
    [placeholderCount],
  );

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.surfaceContainerHigh,
            borderColor: surfaceStroke,
            shadowColor: hexToRgba(theme.shadow, 0.18),
          },
        ]}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.secondaryContainer,
            },
          ]}>
          <View style={styles.headerRow}>
            <View
              style={[
                styles.indicatorBadge,
                {
                  backgroundColor: hexToRgba(theme.onSecondaryContainer, 0.12),
                },
              ]}>
              <ActivityIndicator color={theme.onSecondaryContainer} size="small" />
            </View>
            <Typography variant="titleMedium" style={{ color: theme.onSecondaryContainer }}>
              Searching Reddit
            </Typography>
          </View>
          <Typography
            variant="bodyMedium"
            style={{ color: hexToRgba(theme.onSecondaryContainer, 0.72) }}>
            {query
              ? `Looking for "${query}" ${searchType}. Hang tight while we surface the best matches.`
              : 'Hang tight while we surface the best communities for you.'}
          </Typography>
        </View>

        <View style={styles.placeholderGroup}>
          {placeholders.map((placeholder) => (
            <View
              key={placeholder}
              style={[
                styles.placeholderRow,
                {
                  borderColor: hexToRgba(theme.outlineVariant, 0.25),
                  backgroundColor: hexToRgba(theme.surfaceContainer, 0.9),
                },
              ]}>
              <View
                style={[
                  styles.avatarPlaceholder,
                  {
                    backgroundColor: surfaceMuted,
                  },
                ]}
              />
              <View style={styles.textColumn}>
                <View
                  style={[
                    styles.textLineLarge,
                    {
                      backgroundColor: surfaceMuted,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.textLineMedium,
                    {
                      backgroundColor: hexToRgba(theme.surfaceContainerHighest, 0.7),
                    },
                  ]}
                />
                <View style={styles.metaRow}>
                  <View
                    style={[
                      styles.metaChip,
                      {
                        backgroundColor: hexToRgba(theme.surfaceContainerHighest, 0.65),
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.metaChip,
                      {
                        backgroundColor: hexToRgba(theme.surfaceContainerHighest, 0.5),
                        width: '25%',
                      },
                    ]}
                  />
                </View>
              </View>
              <AnimatedLinearGradient
                pointerEvents="none"
                colors={['transparent', highlightColor, 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[StyleSheet.absoluteFillObject, shimmerStyle(shimmer)]}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: Spacing.s12,
    paddingVertical: Spacing.s16,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.s16,
    gap: Spacing.s16,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 4,
  },
  header: {
    borderRadius: 18,
    padding: Spacing.s16,
    rowGap: Spacing.s8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.s12,
  },
  indicatorBadge: {
    borderRadius: 999,
    paddingHorizontal: Spacing.s12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderGroup: {
    rowGap: Spacing.s12,
  },
  placeholderRow: {
    borderRadius: 20,
    padding: Spacing.s16,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.s16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textColumn: {
    flex: 1,
    rowGap: Spacing.s8,
  },
  textLineLarge: {
    height: 14,
    borderRadius: 999,
    width: '70%',
  },
  textLineMedium: {
    height: 12,
    borderRadius: 999,
    width: '55%',
  },
  metaRow: {
    flexDirection: 'row',
    columnGap: Spacing.s8,
  },
  metaChip: {
    height: 20,
    borderRadius: 999,
    width: '35%',
  },
});

export default SearchPendingLoader;
