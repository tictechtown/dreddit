import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { Post } from '../../../services/api';
import { useStore } from '../../../services/store';
import { Spacing } from '../../typography';
import { getPreviewImageFromStreaminMe, getPreviewImageFromYoutube } from '../../utils';

const PostPreview = ({ post, imageWidth }: { post: Post; imageWidth: number }) => {
  const useLowRes = useStore((state) => state.useLowRes);
  const isCrosspost = Array.isArray(post.data.crosspost_parent_list);
  const maxPreviewResolutions = useMemo(() => {
    if (!post.data.preview) return null;
    const allResolutions = post.data.preview?.images[0].resolutions;
    if (useLowRes) {
      const smallerResolutions = allResolutions.filter((r) => r.width < 640);
      if (smallerResolutions.length === 0) {
        return null;
      }
      return smallerResolutions[smallerResolutions.length - 1];
    }
    return allResolutions[allResolutions.length - 1];
  }, [post.data.preview]);

  if (isCrosspost) {
    return null;
  }

  return (
    <>
      {post.data.domain === 'i.redd.it' && !post.data.preview && (
        <Image
          style={{ width: imageWidth, height: 216, marginTop: Spacing.small }}
          source={post.data.url.replaceAll('&amp;', '&')}
          contentFit="cover"
        />
      )}
      {post.data.domain === 'youtube.com' && (
        <Image
          style={{ width: imageWidth, height: 216, marginTop: Spacing.small }}
          source={getPreviewImageFromYoutube(post.data.url, post.data.media)}
          contentFit="cover"
        />
      )}
      {/* {(post.data.domain === 'dubz.co' ||
        post.data.domain === 'dubz.link' ||
        post.data.domain === 'dubz.live') &&
        !post.data.preview && (
          <Image
            style={{ width: imageWidth, height: 216, marginTop: Spacing.small }}
            source={getPreviewImageFromDubz(post.data.url)}
            contentFit="cover"
          />
        )} */}
      {post.data.domain === 'streamin.one' && !post.data.preview && (
        <Image
          style={{ width: imageWidth, height: 216, marginTop: Spacing.small }}
          source={getPreviewImageFromStreaminMe(post.data.url)}
          contentFit="cover"
        />
      )}
      {maxPreviewResolutions && post.data.domain !== 'youtube.com' && (
        <Image
          style={{
            width: imageWidth,
            height: (imageWidth * maxPreviewResolutions.height) / maxPreviewResolutions.width,
            marginTop: Spacing.small,
          }}
          source={maxPreviewResolutions.url.replaceAll('&amp;', '&')}
          contentFit="cover"
        />
      )}
    </>
  );
};

export default React.memo(PostPreview);
