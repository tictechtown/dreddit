import { Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { decode } from 'html-entities';
import * as React from 'react';
import { DimensionValue, Text, View } from 'react-native';
import base64 from 'react-native-base64';
import { RedditVideo } from '../../../services/api';
import { PaletteDark } from '../../colors';
import Icons from '../../components/Icons';
import { Spacing } from '../../tokens';
import VideoPlayer from './VideoPlayer';
import { extractMetaTags } from './metadata';

type RedditVideoProps = {
  hls_url: string;
  height: DimensionValue;
  width: DimensionValue;
};

export default function Page() {
  const { title, reddit_video, prefetchuri } = useLocalSearchParams();
  const [videoData, setRVideo] = React.useState<RedditVideoProps>();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchMetadata(uri: string) {
      const options = { url: uri };
      const req = await fetch(options.url);
      const html = await req.text();
      const result = extractMetaTags(html, { customMetaTags: [] });
      if (result && 'ogVideo' in result) {
        console.log('loading', result);
        setRVideo({ hls_url: result.ogVideo.url, height: '100%', width: '100%' });
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
          headerStyle: {
            backgroundColor: PaletteDark.scrim,
          },
        }}
      />
      {errorMessage && (
        <View
          style={{
            backgroundColor: PaletteDark.scrim,
            width: '100%',
            height: '100%',
          }}>
          <View
            style={{
              flex: 0,
              position: 'absolute',
              bottom: 20,
              left: 0,
              right: 0,
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: PaletteDark.errorContainer,
              borderRadius: 10,
              flexDirection: 'row',
            }}>
            <Icons name="error" size={36} color={PaletteDark.onErrorContainer} />
            <Text style={{ color: PaletteDark.onErrorContainer, marginLeft: Spacing.s16 }}>
              {errorMessage}
            </Text>
          </View>
        </View>
      )}
      {videoData && (
        <VideoPlayer
          style={{ height: videoData.height, width: '100%', flex: 1 }}
          source={{
            uri: videoData.hls_url,
          }}
        />
      )}
    </View>
  );
}
