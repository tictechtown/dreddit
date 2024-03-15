import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Post } from '../../../services/api';
import { useStore } from '../../../services/store';
import { ColorPalette } from '../../colors';
import Icons from '../../components/Icons';
import Typography from '../../components/Typography';
import { Spacing } from '../../tokens';
import {
  getPreviewImageFromDubz,
  getPreviewImageFromStreaminMe,
  getPreviewImageFromYoutube,
} from '../../utils';

type PostPreviewImageProps = {
  domain: Post['data']['domain'];
  url: Post['data']['url'];
  media: Post['data']['media'];
  preview: Post['data']['preview'];
  imageWidth: number;
  theme: ColorPalette;
};

function getVideoDuration(duration: number): string {
  const mins = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${`${mins}`.padStart(2, '0')}:${`${seconds}`.padStart(2, '0')}`;
}

const PostPreviewVideo = ({
  source,
  domain,
  imageWidth,
  theme,
}: {
  source: string;
  domain: string;
  imageWidth: number;
  theme: ColorPalette;
}) => {
  return (
    <View>
      <View>
        <Image
          style={{
            width: imageWidth,
            height: 210,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
          source={source}
          contentFit="cover"
        />
        <View
          style={{
            position: 'absolute',
            bottom: 16,
            right: 12,
            backgroundColor: theme.surfaceContainerHighest,
            borderRadius: 6,
            paddingHorizontal: Spacing.s8,
            flexDirection: 'row',
          }}>
          <Typography variant="labelMedium">VID</Typography>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          columnGap: 8,
          alignItems: 'center',
          backgroundColor: theme.surfaceContainerHigh,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          padding: 10,
        }}>
        <Icons name="link" size={14} color={theme.onSurface} />
        <Typography variant="labelSmall" style={{ color: theme.onSurfaceVariant }}>
          {domain}
        </Typography>
      </View>
    </View>
  );
};

const PostPreviewStaticMedia = ({
  width,
  height,
  source,
  urlSource,
  theme,
}: {
  width: number;
  height: number;
  source: string;
  urlSource: string;
  theme: ColorPalette;
}) => {
  const isGif = urlSource.includes('.gif');

  return (
    <View>
      <Image
        style={{ width, height, borderRadius: 28 }}
        source={source.replaceAll('&amp;', '&')}
        contentFit="cover"
      />
      {isGif && (
        <View
          style={{
            position: 'absolute',
            bottom: 16,
            right: 12,
            backgroundColor: theme.surfaceContainerHighest,
            borderRadius: 6,
            paddingHorizontal: Spacing.s8,
            flexDirection: 'row',
          }}>
          <Typography variant="labelMedium">GIF</Typography>
        </View>
      )}
    </View>
  );
};

const PostPreviewImage = ({
  domain,
  url,
  media,
  preview,
  imageWidth,
  theme,
}: PostPreviewImageProps) => {
  const useLowRes = useStore((state) => state.useLowRes);
  const maxPreviewResolutions = useMemo(() => {
    if (!preview) return null;
    const allResolutions = preview?.images[0].resolutions;
    if (useLowRes) {
      const smallerResolutions = allResolutions.filter((r) => r.width < 640);
      if (smallerResolutions.length === 0) {
        return null;
      }
      return smallerResolutions[smallerResolutions.length - 1];
    }
    return allResolutions[allResolutions.length - 1];
  }, [preview]);

  let displayedUrl = url;
  if (domain === 'x.com' || domain === 'twitter.com') {
    const twitterName = url
      .replace('https://x.com/', '')
      .replace('https://www.x.com/', '')
      .replace('https://www.twitter.com/', '')
      .replace('https://twitter.com/', '')
      .split('/')[0];

    displayedUrl = `@${twitterName}`;
  }

  const videoDuration =
    media != undefined && typeof media != 'string' && !!media?.reddit_video
      ? media.reddit_video.duration
      : preview?.reddit_video_preview?.duration;
  // Reddit Image
  if (domain === 'i.redd.it' || domain === 'i.imgur.com') {
    if (!preview) {
      return (
        <PostPreviewStaticMedia
          width={imageWidth}
          height={216}
          urlSource={url}
          source={url}
          theme={theme}
        />
      );
    }
    if (maxPreviewResolutions) {
      return (
        <PostPreviewStaticMedia
          width={imageWidth}
          height={(imageWidth * maxPreviewResolutions.height) / maxPreviewResolutions.width}
          urlSource={url}
          source={maxPreviewResolutions.url}
          theme={theme}
        />
      );
    }
    return null;
  }

  // Self Post with Image
  if (domain.startsWith('self.')) {
    if (maxPreviewResolutions) {
      return (
        <PostPreviewStaticMedia
          width={imageWidth}
          height={(imageWidth * maxPreviewResolutions.height) / maxPreviewResolutions.width}
          urlSource={url}
          source={maxPreviewResolutions.url}
          theme={theme}
        />
      );
    }
    return null;
  }

  // Video Preview (Youtube)
  if (domain === 'youtube.com' || domain === 'youtu.be') {
    return (
      <PostPreviewVideo
        source={getPreviewImageFromYoutube(url, media)}
        imageWidth={imageWidth}
        domain={domain}
        theme={theme}
      />
    );
  }

  // Video Preview
  if (domain === 'streamin.one' && !preview) {
    return (
      <PostPreviewVideo
        source={getPreviewImageFromStreaminMe(url)}
        imageWidth={imageWidth}
        domain={domain}
        theme={theme}
      />
    );
  }

  if (domain === 'dubz.live' && !preview) {
    return (
      <PostPreviewVideo
        source={getPreviewImageFromDubz(url)}
        imageWidth={imageWidth}
        domain={domain}
        theme={theme}
      />
    );
  }

  // Article with Small Image
  if (maxPreviewResolutions && maxPreviewResolutions.width < 120) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Image
          style={{
            width: 70,
            height: 70,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
          }}
          source={maxPreviewResolutions.url.replaceAll('&amp;', '&')}
          contentFit="cover"
        />
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
            paddingHorizontal: 16,
            backgroundColor: theme.surfaceContainerHigh,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
          }}>
          <Typography variant="labelMedium">{domain}</Typography>
          <Typography
            variant="labelSmall"
            style={{ color: theme.onSurfaceVariant }}
            numberOfLines={2}>
            {displayedUrl}
          </Typography>
        </View>
      </View>
    );
  }

  // Article with Big Image
  if (maxPreviewResolutions && maxPreviewResolutions.width >= 120) {
    return (
      <View>
        <Image
          style={{
            width: imageWidth,
            height: Math.min(
              210,
              (imageWidth * maxPreviewResolutions.height) / maxPreviewResolutions.width
            ),
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
          source={maxPreviewResolutions.url.replaceAll('&amp;', '&')}
          contentFit="cover"
        />
        <View
          style={{
            flexDirection: 'row',
            columnGap: 8,
            alignItems: 'center',
            backgroundColor: theme.surfaceContainerHigh,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            padding: 10,
          }}>
          <Icons name="link" size={14} color={theme.onSurface} />
          <Typography variant="labelSmall" style={{ color: theme.onSurfaceVariant }}>
            {domain}
          </Typography>
        </View>
        {videoDuration != undefined && (
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              backgroundColor: theme.surfaceContainerHighest,
              borderRadius: 10,
              paddingHorizontal: Spacing.s8,
              flexDirection: 'row',
            }}>
            <Typography variant="labelMedium">{getVideoDuration(videoDuration)}</Typography>
          </View>
        )}
      </View>
    );
  }
  // No Preview with Twitter/X
  // we make an http call to get the picture
  if (domain === 'x.com' || domain === 'twitter.com') {
    const twitterName = url
      .replace('https://x.com/', '')
      .replace('https://twitter.com/', '')
      .split('/')[0];
    const avatarUrl = `https://unavatar.io/twitter/${twitterName}`;

    return (
      <View style={{ flexDirection: 'row' }}>
        <Image
          style={{
            width: 70,
            height: 70,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
          }}
          source={avatarUrl}
          contentFit="cover"
        />
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
            paddingHorizontal: 16,
            backgroundColor: theme.surfaceContainerHigh,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
          }}>
          <Typography variant="labelMedium">{domain}</Typography>
          <Typography
            variant="labelSmall"
            style={{ color: theme.onSurfaceVariant }}
            numberOfLines={2}>
            {displayedUrl}
          </Typography>
        </View>
      </View>
    );
  }

  // No Preview
  return (
    <View
      style={{
        flexDirection: 'row',
        columnGap: 8,
        alignItems: 'center',
        backgroundColor: theme.surfaceContainerHigh,
        borderRadius: 12,
        padding: 10,
      }}>
      <Icons name="link" size={14} color={theme.onSurface} />
      <Typography variant="labelSmall" style={{ color: theme.onSurfaceVariant }}>
        {domain}
      </Typography>
    </View>
  );
};

const PostPreview = ({
  post,
  imageWidth,
  theme,
}: {
  post: Post;
  imageWidth: number;
  theme: ColorPalette;
}) => {
  const isCrosspost = Array.isArray(post.data.crosspost_parent_list);

  if (isCrosspost && post.data.crosspost_parent_list !== undefined) {
    const xpost = post.data.crosspost_parent_list[0];
    return (
      <PostPreviewImage
        domain={xpost.subreddit_name_prefixed}
        preview={xpost.preview}
        url={xpost.url}
        media={xpost.media}
        imageWidth={imageWidth}
        theme={theme}
      />
    );
  }

  // Gallery
  if (post.data.gallery_data) {
    return null;
  }

  return (
    <PostPreviewImage
      domain={post.data.domain}
      preview={post.data.preview}
      url={post.data.url}
      media={post.data.media}
      imageWidth={imageWidth}
      theme={theme}
    />
  );
};

export default React.memo(PostPreview);
