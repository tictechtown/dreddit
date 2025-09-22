import { useLocalSearchParams } from 'expo-router';
import SubredditFeedPage from './SubredditFeedPage';

export default function Page() {
  const { id, icon } = useLocalSearchParams();
  console.log('page', { id, icon });
  return <SubredditFeedPage subreddit={id as string} icon={icon as string} />;
}
