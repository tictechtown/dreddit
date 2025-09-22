import { Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { decode } from 'html-entities';
import * as React from 'react';
import { Text, TouchableNativeFeedback, View } from 'react-native';
import base64 from 'react-native-base64';
import { RedditVideo } from '../../../services/api';
import { PaletteDark } from '../../../colors';
import Icons from '../../../components/Icons';
import { Spacing } from '../../../tokens';
import VideoPlayer from './VideoPlayer';
import { extractMetaTags } from '../../../features/video/metadata';
import Typography from '../../../components/Typography';
import useTheme from '../../../services/theme/useTheme';

type RedditVideoProps = { hls_url: string };

export default function Page() {
  const { title, reddit_video, prefetchuri } = useLocalSearchParams();
  const [videoData, setRVideo] = React.useState<RedditVideoProps>();
  const [errorMessage, setErrorMessage] = React.useState<string | null>();
  const theme = useTheme();

  React.useEffect(() => {
    async function fetchMetadata(uri: string) {
      const req = await fetch(uri);
      const html = await req.text();
      const result = extractMetaTags(html, { customMetaTags: [], allMedia: true });
      if (result && 'ogVideo' in result) {
        console.log('loading', uri, result);
        let ogVideo;
        if (Array.isArray(result.ogVideo)) {
          const availableVideos = result.ogVideo.filter((video) => video.url.startsWith('http'));
          ogVideo = availableVideos.at(-1);
        } else {
          ogVideo = result.ogVideo;
        }
        if (ogVideo == undefined) {
          setErrorMessage(`cant load video from url ${uri}`);
          WebBrowser.openBrowserAsync(uri);
        } else {
          setRVideo({ hls_url: ogVideo.url });
        }
      } else {
        setErrorMessage(`cant load video from url ${uri}`);
        WebBrowser.openBrowserAsync(uri);
      }
    }
    if (prefetchuri) {
      const uri: string = prefetchuri as string;
      fetchMetadata(uri);
    }
  }, [prefetchuri]);

  React.useEffect(() => {
    if (reddit_video) {
      setRVideo(JSON.parse(base64.decode(reddit_video as string)) as RedditVideo);
    }
  }, []);

  console.log('playing', videoData?.hls_url);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: PaletteDark.scrim,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Stack.Screen
        options={{
          title: decode(title as string),
          headerStyle: { backgroundColor: PaletteDark.scrim },
        }}
      />
      {errorMessage && (
        <View style={{ backgroundColor: PaletteDark.scrim, width: '100%', height: '100%' }}>
          <View
            style={{
              flex: 0,
              position: 'absolute',
              bottom: 40,
              left: 0,
              right: 0,
              paddingHorizontal: Spacing.s16,
              paddingVertical: Spacing.s12,
              backgroundColor: PaletteDark.errorContainer,
              borderRadius: 10,
              flexDirection: 'row',
              columnGap: Spacing.s16,
            }}>
            <Icons name="error" size={36} color={PaletteDark.onErrorContainer} />
            <Text style={{ color: PaletteDark.onErrorContainer }}>{errorMessage}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 12 }}>
            <TouchableNativeFeedback
              onPress={() => WebBrowser.openBrowserAsync(prefetchuri as string)}>
              <View
                style={{
                  backgroundColor: theme.primaryContainer,
                  borderRadius: 20,
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Typography style={{ color: theme.onPrimaryContainer }} variant="bodyMedium">
                  Open Link
                </Typography>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      )}
      {videoData && (
        <VideoPlayer
          style={{ height: '100%', width: '100%', flex: 1 }}
          source={{ uri: videoData.hls_url }}
          onError={setErrorMessage}
        />
      )}
    </View>
  );
}
