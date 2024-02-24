import { useLocalSearchParams } from 'expo-router';
import { Post } from '../../services/api';
import postCache from '../../services/postCache';
import PostDetailsView from './PostDetailsView';

export default function Page() {
  const { postid } = useLocalSearchParams();

  const cachedPost = postCache.getCache(postid as string);
  console.log('showing page', { postid });
  return <PostDetailsView postId={postid as string} cachedPost={cachedPost as Post | null} />;
}
