import { useCallback, useState } from 'react';
import { Text } from 'react-native';
import useTheme from '@services/theme/useTheme';

const CommentSpoiler = ({ content }: { content: string }) => {
  const theme = useTheme();
  const [isRevealed, setIsRevealed] = useState(false);

  const revealPost = useCallback(() => {
    setIsRevealed(true);
  }, [setIsRevealed]);

  return (
    <Text
      onPress={revealPost}
      style={{
        backgroundColor: isRevealed ? theme.surface : theme.surfaceVariant,
        color: isRevealed ? theme.secondary : theme.surfaceVariant,
      }}>
      {content}
    </Text>
  );
};

export default CommentSpoiler;
