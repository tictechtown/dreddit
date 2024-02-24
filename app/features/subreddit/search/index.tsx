import { useLocalSearchParams } from 'expo-router';
import PostSearch from './PostSearch';

export default function Page() {
  const { subreddit, initialQuery } = useLocalSearchParams();

  return (
    <PostSearch subreddit={subreddit as string} initialQuery={initialQuery as string | null} />
  );
}
