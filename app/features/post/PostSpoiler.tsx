import { useCallback, useState } from 'react';
import { Text } from 'react-native';
import { Palette } from '../colors';

const PostSpoiler = ({ content }: { content: string }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const revealPost = useCallback(() => {
    setIsRevealed(true);
  }, [setIsRevealed]);

  return (
    <Text
      onPress={revealPost}
      style={{
        backgroundColor: isRevealed ? Palette.backgroundLowest : Palette.surfaceVariant,
        color: isRevealed ? Palette.secondary : Palette.surfaceVariant,
      }}>
      {content}
    </Text>
  );
};

export default PostSpoiler;
