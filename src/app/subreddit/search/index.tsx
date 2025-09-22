import { useLocalSearchParams } from 'expo-router';
import SubredditSearchPage from './SubredditSearchPage';

export default function Page() {
  const { subreddit, initialQuery } = useLocalSearchParams();

  return (
    <SubredditSearchPage
      subreddit={subreddit as string}
      initialQuery={initialQuery as string | null}
    />
  );
}
