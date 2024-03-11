import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Post } from '../../../services/api';
import { useStore } from '../../../services/store';
import { Palette } from '../../colors';
import Typography from '../../components/Typography';
import { Spacing } from '../../typography';
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
}: {
  source: string;
  domain: string;
  imageWidth: number;
}) => {
  return (
    <View>
      <Image
        style={{
          width: imageWidth,
          height: 216,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
        source={source}
        contentFit="cover"
      />
      <View style={{ position: 'absolute', bottom: 40, right: 10 }}>
        <MaterialIcons name="play-circle-outline" size={30} color={Palette.onSurfaceVariant} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          columnGap: 8,
          alignItems: 'center',
          backgroundColor: Palette.surfaceContainer,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          padding: 10,
        }}>
        <MaterialIcons name="link" size={14} color={Palette.onSurface} />
        <Typography variant="labelSmall" style={{ color: Palette.onSurfaceVariant }}>
          {domain}
        </Typography>
      </View>
    </View>
  );
};

const PostPreviewImage = ({ domain, url, media, preview, imageWidth }: PostPreviewImageProps) => {
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
      .replace('https://twitter.com/', '')
      .split('/')[0];

    displayedUrl = `@${twitterName}`;
  }

  // Reddit Image
  if (domain === 'i.redd.it' || domain === 'i.imgur.com') {
    if (!preview) {
      return (
        <Image
          style={{ width: imageWidth, height: 216, borderRadius: 12 }}
          source={url.replaceAll('&amp;', '&')}
          contentFit="cover"
        />
      );
    }
    if (maxPreviewResolutions) {
      return (
        <Image
          style={{
            width: imageWidth,
            height: (imageWidth * maxPreviewResolutions.height) / maxPreviewResolutions.width,
            borderRadius: 12,
          }}
          source={maxPreviewResolutions.url.replaceAll('&amp;', '&')}
          contentFit="cover"
        />
      );
    }
    return null;
  }

  // Self Post with Image
  if (domain.startsWith('self.')) {
    if (maxPreviewResolutions) {
      return (
        <Image
          style={{
            width: imageWidth,
            height: (imageWidth * maxPreviewResolutions.height) / maxPreviewResolutions.width,
            borderRadius: 12,
          }}
          source={maxPreviewResolutions.url.replaceAll('&amp;', '&')}
          contentFit="cover"
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
      />
    );
  }

  if (domain === 'dubz.live' && !preview) {
    return (
      <PostPreviewVideo
        source={getPreviewImageFromDubz(url)}
        imageWidth={imageWidth}
        domain={domain}
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
            backgroundColor: Palette.surfaceContainer,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
          }}>
          <Typography variant="labelMedium">{domain}</Typography>
          <Typography
            variant="labelSmall"
            style={{ color: Palette.onSurfaceVariant }}
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
            height: (imageWidth * maxPreviewResolutions.height) / maxPreviewResolutions.width,
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
            backgroundColor: Palette.surfaceContainer,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            padding: 10,
            top: -1,
          }}>
          <MaterialIcons name="link" size={14} color={Palette.onSurface} />
          <Typography variant="labelSmall" style={{ color: Palette.onSurfaceVariant }}>
            {domain}
          </Typography>
        </View>
        {media != undefined && typeof media != 'string' && !!media?.reddit_video && (
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              backgroundColor: Palette.surfaceContainerHigh,
              borderRadius: 10,
              paddingHorizontal: Spacing.xsmall,
              flexDirection: 'row',
            }}>
            <Typography variant="labelMedium">
              {getVideoDuration(media.reddit_video.duration)}
            </Typography>
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
            backgroundColor: Palette.surfaceContainer,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
          }}>
          <Typography variant="labelMedium">{domain}</Typography>
          <Typography
            variant="labelSmall"
            style={{ color: Palette.onSurfaceVariant }}
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
        backgroundColor: Palette.surfaceContainer,
        borderRadius: 12,
        padding: 10,
      }}>
      <MaterialIcons name="link" size={14} color={Palette.onSurface} />
      <Typography variant="labelSmall" style={{ color: Palette.onSurfaceVariant }}>
        {domain}
      </Typography>
    </View>
  );
};

const PostPreview = ({ post, imageWidth }: { post: Post; imageWidth: number }) => {
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
    />
  );
};

export default React.memo(PostPreview);
