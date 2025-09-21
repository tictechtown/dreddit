import { useLocalSearchParams } from 'expo-router';
import SubredditSearch from './SubredditSearch';

export default function Page() {
  const { subreddit, initialQuery } = useLocalSearchParams();

  return (
    <SubredditSearch subreddit={subreddit as string} initialQuery={initialQuery as string | null} />
  );
}
