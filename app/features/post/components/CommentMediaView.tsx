import Markdown from '@ronradtke/react-native-markdown-display';
import { Image } from 'expo-image';
import { decode } from 'html-entities';
import { useCallback } from 'react';
import { Pressable } from 'react-native';
import { RedditMediaMedata } from '../../../services/api';
import useTheme from '../../../services/theme/useTheme';
import { Spacing } from '../../tokens';
import { markdownIt, markdownRenderRules, useMarkdownStyle } from '../utils';

const CommentMediaView = ({
  item,
  body,
  showGif,
}: {
  item: RedditMediaMedata;
  body: string;
  showGif: (value: RedditMediaMedata) => void;
}) => {
  const theme = useTheme();
  const mdStyle = useMarkdownStyle(theme);

  const onPress = useCallback(() => {
    showGif(item);
  }, [item]);

  if (!item) {
    return null;
  }
  if (item.t === 'emoji' || item.t === 'sticker') {
    return (
      <Image
        style={{
          width: item.s.x,
          height: item.s.y,
        }}
        source={(item.s.gif ?? item.s.u).replaceAll('&amp;', '&')}
      />
    );
  }

  const preview: undefined | { x: number; y: number; u: string } = item.p[0] ?? item.s;

  if (!preview) {
    console.log(item);
    return null;
  }

  return (
    <Pressable onPress={onPress}>
      <Markdown markdownit={markdownIt} style={mdStyle} rules={markdownRenderRules}>
        {decode(body.replace(item.s.u, '').replace(`![gif](${item.id})`, ''))}
      </Markdown>
      <Image
        style={{
          borderRadius: 8,
          marginTop: Spacing.s12,
          width: preview.x,
          height: preview.y,
        }}
        source={preview.u.replaceAll('&amp;', '&')}
      />
    </Pressable>
  );
};

export default CommentMediaView;
