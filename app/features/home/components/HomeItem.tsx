import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Text, TouchableNativeFeedback, View } from 'react-native';
import { Palette } from '../../colors';
import { Spacing } from '../../typography';

const HomeItem = ({
  subreddit,
  icon,
  description,
}: {
  subreddit: string;
  icon: string | null | undefined;
  description: string | null | undefined;
}) => {
  return (
    <View style={{ flex: 1, marginVertical: 2, paddingHorizontal: Spacing.small }}>
      <Link
        href={{
          pathname: `features/subreddit/${subreddit}`,
          params: {
            icon: icon?.replaceAll('&amp;', '&') ?? require('../../../../assets/images/subbit.png'),
          },
        }}
        asChild>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple(Palette.surfaceVariant, false)}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 8,
              flexDirection: 'row',
              backgroundColor: Palette.surface,
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                marginRight: Spacing.regular,
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
              <Text style={{ color: Palette.onBackground, fontSize: 18, fontWeight: 'bold' }}>
                r/{subreddit}
              </Text>
              {description && (
                <Text style={{ color: Palette.onBackground }} numberOfLines={2}>
                  {description}
                </Text>
              )}
            </View>
          </View>
        </TouchableNativeFeedback>
      </Link>
    </View>
  );
};

export default HomeItem;
