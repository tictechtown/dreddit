// TODO - move that to /components/ and rename it
import { TouchableOpacity, ViewStyle } from 'react-native';
import useTheme from '../../../services/theme/useTheme';
import Icons, { IconName } from '../../../components/Icons';
import Typography from '../../../components/Typography';
import { Spacing } from '../../../tokens';
import { BottomSheetView } from '@gorhom/bottom-sheet';

interface SortOption<T extends string> {
  key: T;
  display: string;
  icon?: IconName;
}

interface SortOptionProps<T extends string = string> {
  currentSort: T | null;
  title?: string | null;
  onSortPressed: (value: T) => void;
  options: SortOption<T>[];
}

const PostDetailsSortOptions = <T extends string>({
  currentSort,
  title,
  onSortPressed,
  options,
}: SortOptionProps<T>) => {
  const theme = useTheme();

  const choiceContainer: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.surface,
  };

  const selectedChoiceContainer = { borderRadius: 10, borderColor: theme.secondaryContainer };

  const choices = { marginVertical: Spacing.s12, marginLeft: Spacing.s12 };

  return (
    <BottomSheetView
      style={{
        flex: 1,
        backgroundColor: theme.surface,
        paddingHorizontal: Spacing.s16,
        paddingBottom: Spacing.s32,
      }}>
      <Typography variant="titleLarge" style={{ marginBottom: Spacing.s16 }}>
        {title ?? 'Sort options'}
      </Typography>
      {options.map((option) => {
        return (
          <TouchableOpacity
            key={option.key}
            style={[choiceContainer, currentSort === option.key ? selectedChoiceContainer : null]}
            onPress={() => {
              onSortPressed(option.key);
            }}>
            {option.icon && <Icons name={option.icon} size={16} color={theme.onSurface} />}
            <Typography variant="bodyLarge" style={choices}>
              {option.display}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </BottomSheetView>
  );
};

export default PostDetailsSortOptions;
