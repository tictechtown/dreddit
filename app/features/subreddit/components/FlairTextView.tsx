import { Image } from 'expo-image';
import { decode } from 'html-entities';
import { Text, View } from 'react-native';
import { FlairRichText, Post } from '../../../services/api';
import { Palette } from '../../colors';

type Props = {
  flair_text: string | null;
  flair_richtext: Post['data']['link_flair_richtext'];
  flair_background_color?: Post['data']['link_flair_background_color'];
  pinned: boolean | undefined;
  stickied: boolean | undefined;
  flair_type: Post['data']['link_flair_type'];
  over_18?: boolean | undefined;
  containerStyle: any;
  textStyle?: any;
  theme: Palette;
};

const FlairTextView = (props: Props) => {
  const displayPin = props.pinned || props.stickied;

  let elementsToDisplay: FlairRichText[] = Array.isArray(props.flair_richtext)
    ? props.flair_richtext ?? []
    : [];

  if (elementsToDisplay.length === 0 && props.flair_text !== null) {
    elementsToDisplay.push({ e: 'text', t: props.flair_text });
  }

  if (props.over_18) {
    elementsToDisplay = [...[{ e: 'text', t: 'NSFW ' } as FlairRichText], ...elementsToDisplay];
  }

  if (displayPin) {
    elementsToDisplay = [...[{ e: 'text', t: '📍' } as FlairRichText], ...elementsToDisplay];
    if (elementsToDisplay.length === 1) {
      elementsToDisplay.push({ e: 'text', t: 'Pinned' });
    }
  }

  if (elementsToDisplay.length === 0) {
    return null;
  }

  return (
    <View
      style={{
        ...props.containerStyle,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 2,
      }}>
      {elementsToDisplay.map((it, index) => {
        if (it.e === 'text') {
          let displayedItem = decode(it.t);
          if (displayedItem.length > 22) {
            displayedItem = displayedItem.slice(0, 22) + '...';
          }

          return (
            <Text
              numberOfLines={1}
              key={`${it.t}.${index}`}
              style={
                props.textStyle
                  ? props.textStyle
                  : { color: props.theme.onBackground, fontSize: 11 }
              }>
              {displayedItem}
            </Text>
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
  );
};

export default FlairTextView;
