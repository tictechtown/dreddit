import { useCallback } from 'react';
import { onLinkPress } from '@features/subreddit/utils';
import * as WebBrowser from 'expo-web-browser';
import type { Post } from '@services/api';
import type { Router } from 'expo-router';

export default (post: Post | null | undefined, router: Router) => {
  return useCallback(() => {
    if (!post) {
      return;
    }
    if (
      post.data.domain !== 'reddit.com' ||
      post.data.is_gallery ||
      Array.isArray(post.data.crosspost_parent_list)
    ) {
      const href = onLinkPress(post);
      if (typeof href === 'object' && href.pathname === 'full' && href.params) {
        WebBrowser.openBrowserAsync((href.params.uri as string).replaceAll('&amp;', '&'), {
          createTask: false,
        });
      } else {
        router.push(href);
      }
    } else {
      // a bit dirty, reddit.com is usually from a previously shared post
      // so we fetch the post (async) to get the redirected url
      // then parse the url to get the final postId
      fetch(post.data.url).then((data) => {
        const postId = data.url.split('comments/')[1].split('/')[0];
        if (postId !== undefined) {
          router.push({
            pathname: `post/${postId}`,
            params: { postid: postId },
          });
        } else {
          console.warn('couldnt get postId from url:', data.url);
        }
      });
    }
  }, [post?.data.id]);
};
