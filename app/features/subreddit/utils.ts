import { HrefObject } from 'expo-router/build/link/href';
import base64 from 'react-native-base64';
import { Post } from '../../services/api';

export const onLinkPress = (post: Post): HrefObject => {
  let originalPost = post;

  console.log('onLinkPRess', post);

  if (Array.isArray(post.data.crosspost_parent_list)) {
    originalPost = { kind: 't3', data: post.data.crosspost_parent_list[0] };
  }
  const domain = originalPost.data.domain;
  // if "%" is in the table, the navigation will crash
  const title = originalPost.data.title
    .replaceAll('%', '')
    .replaceAll('(', '&lpar;')
    .replaceAll(')', '&rpar;');

  if (originalPost.data.gallery_data) {
    return {
      pathname: 'features/media/gallery',
      params: {
        gallery_data: base64.encode(JSON.stringify(originalPost.data.gallery_data)),
        media_metadata: base64.encode(JSON.stringify(originalPost.data.media_metadata)),
        title,
      },
    };
  } else if (domain.startsWith('self.') || domain.startsWith('reddit.com')) {
    return {
      pathname: `features/post/${originalPost.data.id}`,
      params: { postid: originalPost.data.id },
    };
  } else if (domain.startsWith('i.redd.it')) {
    return {
      pathname: 'features/media/image',
      params: { uri: originalPost.data.url, title },
    };
  } else if (
    domain.startsWith('i.imgur.com') &&
    originalPost.data.preview?.reddit_video_preview != null
  ) {
    return {
      pathname: 'features/media/video',
      params: {
        title,
        reddit_video: base64.encode(JSON.stringify(originalPost.data.preview.reddit_video_preview)),
      },
    };
  } else if (domain.startsWith('i.imgur.com')) {
    if (originalPost.data.url_overridden_by_dest?.endsWith('.mp4')) {
      return {
        pathname: 'features/media/video',
        params: {
          title,
          reddit_video: base64.encode(
            JSON.stringify({
              hls_url: originalPost.data.url_overridden_by_dest,
              height: '100%',
              width: '100%',
            })
          ),
        },
      };
    }
    return {
      pathname: 'features/media/image',
      params: {
        title,
        uri: originalPost.data.url_overridden_by_dest,
      },
    };
  } else if (domain.startsWith('v.redd.it') && typeof originalPost.data?.media !== 'string') {
    return {
      pathname: 'features/media/video',
      params: {
        title,
        reddit_video: base64.encode(JSON.stringify(originalPost.data?.media?.reddit_video)),
      },
    };
  } else if (
    domain.startsWith('dubz.co') ||
    domain.startsWith('dubz.link') ||
    domain.startsWith('dubz.live')
  ) {
    return {
      pathname: 'features/media/video',
      params: {
        title,
        prefetchuri: originalPost.data.url,
      },
    };
  } else if (domain.startsWith('imgur.com')) {
    // usually, that's a video?
    return {
      pathname: 'features/media/video',
      params: {
        title,
        prefetchuri: originalPost.data.url,
      },
    };
  } else if (domain.startsWith('streamin.one') || domain.startsWith('streamable.com')) {
    return {
      pathname: 'features/media/video',
      params: {
        title,
        prefetchuri: originalPost.data.url,
      },
    };
  } else if (domain.startsWith('redgifs.com') || domain.startsWith('v3.redgifs.com')) {
    if (originalPost.data.preview?.reddit_video_preview) {
      return {
        pathname: 'features/media/video',
        params: {
          title,
          reddit_video: base64.encode(
            JSON.stringify({
              hls_url: originalPost.data.preview?.reddit_video_preview?.hls_url,
              height: '100%',
              width: '100%',
            })
          ),
        },
      };
    } else {
      return {
        pathname: 'features/media/video',
        params: {
          title,
          prefetchuri: originalPost.data.url,
        },
      };
    }
  } else if (domain.startsWith('i.redgifs.com')) {
    return {
      pathname: 'features/media/image',
      params: {
        title,
        uri: originalPost.data.preview?.images[0].source.url,
      },
    };
  } else {
    return {
      pathname: 'features/full',
      params: { uri: originalPost.data.url, title },
    };
  }
};

export function getAllUniqueFlairs(posts: Post[], previousFlairs: string[]): string[] {
  const r = posts
    .map((p) => {
      const t = p.data.link_flair_text;
      if (t && t.includes(':')) {
        const _ar = t.split(':');
        return _ar[_ar.length - 1].trim();
      }
      return t;
    })
    .filter(Boolean);

  return [...new Set([...previousFlairs, ...r])];
}
