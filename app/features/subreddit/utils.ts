import { HrefObject } from 'expo-router/build/link/href';
import base64 from 'react-native-base64';
import { Post } from '../../services/api';

export const onLinkPress = (post: Post): HrefObject => {
  let originalPost = post;

  console.log('onLinkPRess', post);

  if (
    Array.isArray(post.data.crosspost_parent_list) &&
    post.data.crosspost_parent_list.length > 0
  ) {
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
        gallery_data: base64.encode(
          encodeURIComponent(JSON.stringify(originalPost.data.gallery_data))
        ),
        media_metadata: base64.encode(JSON.stringify(originalPost.data.media_metadata)),
        title,
      },
    };
  }
  if (domain.startsWith('self.') || domain.startsWith('reddit.com')) {
    return {
      pathname: `features/post/${originalPost.data.id}`,
      params: { postid: originalPost.data.id },
    };
  }
  if (domain.startsWith('i.redd.it')) {
    // if GIF, we try to use the mp4 version instead (better performance)
    if (originalPost.data.url.includes('.gif')) {
      if (originalPost.data.preview?.images[0]?.variants?.mp4?.source) {
        const source = originalPost.data.preview?.images[0].variants['mp4'].source;

        const reddit_video = {
          hls_url: source.url.replaceAll('&amp;', '&'),
          height: source.height,
          width: source.width,
        };

        return {
          pathname: 'features/media/video',
          params: {
            title,
            reddit_video: base64.encode(JSON.stringify(reddit_video)),
          },
        };
      }
    }

    return {
      pathname: 'features/media/image',
      params: { uri: originalPost.data.url, title },
    };
  }
  if (domain.startsWith('i.imgur.com') && originalPost.data.preview?.reddit_video_preview != null) {
    return {
      pathname: 'features/media/video',
      params: {
        title,
        reddit_video: base64.encode(JSON.stringify(originalPost.data.preview.reddit_video_preview)),
      },
    };
  }
  if (domain.startsWith('i.imgur.com')) {
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
  }
  if (domain.startsWith('v.redd.it') && typeof originalPost.data?.media !== 'string') {
    return {
      pathname: 'features/media/video',
      params: {
        title,
        reddit_video: base64.encode(JSON.stringify(originalPost.data?.media?.reddit_video)),
      },
    };
  }

  if (
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
  }

  if (domain.startsWith('imgur.com')) {
    // usually, that's a video?
    return {
      pathname: 'features/media/video',
      params: {
        title,
        prefetchuri: originalPost.data.url,
      },
    };
  }

  if (domain.startsWith('streamin.one') || domain.startsWith('streamable.com')) {
    return {
      pathname: 'features/media/video',
      params: {
        title,
        prefetchuri: originalPost.data.url,
      },
    };
  }

  if (domain.startsWith('streamff')) {
    const videoComponents = originalPost.data.url.split('/');
    const videoId = videoComponents[videoComponents.length - 1];
    const newUrl = `https://ffedge.streamff.com/uploads/${videoId}.mp4`;
    return {
      pathname: 'features/media/video',
      params: {
        title,
        reddit_video: base64.encode(
          JSON.stringify({
            hls_url: newUrl,
            height: '100%',
            width: '100%',
          })
        ),
      },
    };
  }

  if (domain.startsWith('caulse.com')) {
    return {
      pathname: 'features/media/video',
      params: {
        title,
        reddit_video: base64.encode(
          JSON.stringify({
            hls_url: originalPost.data.url.replace('/v/', '/videos/') + '.mp4',
            height: '100%',
            width: '100%',
          })
        ),
      },
    };
  }

  if (domain.startsWith('redgifs.com') || domain.startsWith('v3.redgifs.com')) {
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
  }

  if (domain.startsWith('i.redgifs.com')) {
    return {
      pathname: 'features/media/image',
      params: {
        title,
        uri: originalPost.data.preview?.images[0].source.url,
      },
    };
  }

  {
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
