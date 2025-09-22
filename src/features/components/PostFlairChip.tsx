import { Image } from 'expo-image';
import { decode } from 'html-entities';
import { Pressable, TextStyle, View, ViewStyle } from 'react-native';
import type { FlairRichText, Post } from '../../services/api';
import { ColorPalette } from '../../colors';
import Typography from './Typography';
import { Spacing } from '../../tokens';

type Props = {
  flair_text: string | null;
  flair_richtext: Post['data']['link_flair_richtext'];
  flair_background_color?: Post['data']['link_flair_background_color'];
  pinned: boolean | undefined;
  stickied: boolean | undefined;
  flair_type: Post['data']['link_flair_type'];
  over_18?: boolean | undefined;
  outlined?: boolean | undefined;
  theme: ColorPalette;
  onPress?: ((text: string) => void) | undefined;
};

const PostFlairChip = (props: Props) => {
  const displayPin = props.pinned || props.stickied;

  let elementsToDisplay: FlairRichText[] = Array.isArray(props.flair_richtext)
    ? (props.flair_richtext ?? [])
    : [];

  if (elementsToDisplay.length === 0 && props.flair_text !== null) {
    elementsToDisplay.push({ e: 'text', t: props.flair_text });
  }

  if (props.over_18) {
    elementsToDisplay = [{ e: 'text', t: 'NSFW' } as FlairRichText, ...elementsToDisplay];
  }

  if (displayPin) {
    elementsToDisplay = [{ e: 'text', t: '📍' } as FlairRichText, ...elementsToDisplay];
    if (elementsToDisplay.length === 1) {
      elementsToDisplay.push({ e: 'text', t: 'Pinned' });
    }
  }

  if (elementsToDisplay.length === 0) {
    return null;
  }

  const containerStyle: ViewStyle = props.outlined
    ? {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: props.theme.outlineVariant,
        borderWidth: 1,
        borderRadius: Spacing.s8,
        paddingHorizontal: Spacing.s8,
        paddingVertical: Spacing.s4,
        flexDirection: 'row',
      }
    : {};

  const textStyle: TextStyle = props.outlined
    ? { color: props.theme.onSurfaceVariant, fontSize: 12, fontWeight: '500' }
    : { color: props.theme.onSurfaceVariant, fontSize: 11, fontWeight: '400' };

  return (
    <Pressable
      disabled={!props.onPress}
      onPress={() => {
        if (props.onPress && props.flair_text) {
          props.onPress(props.flair_text);
        }
      }}>
      <View style={{ ...containerStyle, flexDirection: 'row', alignItems: 'center', columnGap: 2 }}>
        {elementsToDisplay.map((it, index) => {
          if (it.e === 'text') {
            let displayedItem = decode(it.t);
            if (displayedItem.length > 22) {
              displayedItem = displayedItem.slice(0, 22) + '...';
            }

            return (
              <Typography
                variant="labelMedium"
                numberOfLines={1}
                key={`${it.t}.${index}`}
                style={textStyle}>
                {displayedItem}
              </Typography>
            );
          }
          return (
            <Image
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: props.flair_background_color ?? undefined,
              }}
              key={`${it.a}.${index}`}
              source={it.u}
            />
          );
        })}
      </View>
    </Pressable>
  );
};

export default PostFlairChip;
