import { useLocalSearchParams } from 'expo-router';
import { Post } from '../../services/api';
import postCache from '../../services/postCache';
import PostDetailsPage from './PostDetailsPage';

export default function Page() {
  const { postid } = useLocalSearchParams();

  const cachedPost = postCache.getCache(postid as string);
  console.log('showing page', { postid });
  return <PostDetailsPage postId={postid as string} cachedPost={cachedPost as Post | null} />;
}
