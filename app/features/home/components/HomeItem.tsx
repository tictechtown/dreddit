import { Link } from 'expo-router';
import { TouchableNativeFeedback, View } from 'react-native';
import useTheme from '../../../services/theme/useTheme';
import SubredditIcon from '../../components/SubredditIcon';
import Typography from '../../components/Typography';

const HomeItem = ({
  subreddit,
  icon,
  description,
  onIconNotFoundError,
}: {
  subreddit: string;
  icon: string | null | undefined;
  description: string | null | undefined;
  onIconNotFoundError: () => void;
}) => {
  const theme = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <Link
        href={{
          pathname: `features/subreddit/${subreddit}`,
          params: {
            icon: icon?.replaceAll('&amp;', '&') ?? require('../../../../assets/images/subbit.svg'),
          },
        }}
        asChild>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple(theme.surfaceVariant, false)}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 16,
            }}>
            <SubredditIcon
              size={50}
              icon={icon}
              nsfw={false}
              onIconNotFoundError={onIconNotFoundError}
            />
            <View
              style={{
                flex: 1,
              }}>
              <Typography variant="titleMedium" style={{ color: theme.onSurface }}>
                r/{subreddit}
              </Typography>
              {description && (
                <Typography
                  variant="bodyMedium"
                  style={{ color: theme.onSurfaceVariant }}
                  numberOfLines={2}>
                  {description}
                </Typography>
              )}
            </View>
          </View>
        </TouchableNativeFeedback>
      </Link>
    </View>
  );
};

export default HomeItem;
