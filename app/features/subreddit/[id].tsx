import { useLocalSearchParams } from 'expo-router';
import SubRedditView from './SubredditView';

export default function Page() {
  const { id, icon } = useLocalSearchParams();
  console.log('page', { id, icon });
  return <SubRedditView subreddit={id as string} icon={icon as string} />;
}
