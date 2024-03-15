import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { TouchableNativeFeedback, View } from 'react-native';
import useTheme from '../../../services/theme/useTheme';
import Typography from '../../components/Typography';

const HomeItem = ({
  subreddit,
  icon,
  description,
}: {
  subreddit: string;
  icon: string | null | undefined;
  description: string | null | undefined;
}) => {
  const theme = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <Link
        href={{
          pathname: `features/subreddit/${subreddit}`,
          params: {
            icon: icon?.replaceAll('&amp;', '&') ?? require('../../../../assets/images/subbit.png'),
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
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                flex: 0,
              }}
              source={
                icon?.replaceAll('&amp;', '&') ?? require('../../../../assets/images/subbit.png')
              }
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
