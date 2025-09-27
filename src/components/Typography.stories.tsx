import { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, View } from 'react-native';
import Typography from './Typography';

type TypographyVariant = React.ComponentProps<typeof Typography>['variant'];

const REGULAR_VARIANTS: TypographyVariant[] = [
  'displayLarge',
  'displayMedium',
  'displaySmall',
  'headlineLarge',
  'headlineMedium',
  'headlineSmall',
  'titleLarge',
  'titleMedium',
  'titleSmall',
  'bodyLarge',
  'bodyMedium',
  'bodySmall',
  'labelLarge',
  'labelMedium',
  'labelSmall',
  'overline',
];

const EMPHASIZED_VARIANTS: TypographyVariant[] = [
  'displayLargeEmphasized',
  'displayMediumEmphasized',
  'displaySmallEmphasized',
  'headlineLargeEmphasized',
  'headlineMediumEmphasized',
  'headlineSmallEmphasized',
  'titleLargeEmphasized',
  'titleMediumEmphasized',
  'titleSmallEmphasized',
  'bodyLargeEmphasized',
  'bodyMediumEmphasized',
  'bodySmallEmphasized',
  'labelLargeEmphasized',
  'labelMediumEmphasized',
  'labelSmallEmphasized',
];

const TypographyPreview = ({ variants }: { variants: TypographyVariant[] }) => (
  <ScrollView contentContainerStyle={{ padding: 16 }}>
    {variants.map((variant) => (
      <View key={variant} style={{ marginBottom: 16 }}>
        <Typography variant="labelSmallEmphasized" style={{ marginBottom: 4 }}>
          {variant}
        </Typography>
        <Typography variant={variant}>The quick brown fox jumps over the lazy dog.</Typography>
      </View>
    ))}
  </ScrollView>
);

const meta = {
  component: Typography,
  args: {
    variant: 'bodyMedium',
    children: 'Typography sample',
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => <TypographyPreview variants={REGULAR_VARIANTS} />,
};

export const EmphasizedVariants: Story = {
  render: () => <TypographyPreview variants={EMPHASIZED_VARIANTS} />,
};
