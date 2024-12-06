import queryString from 'query-string';
import { useMemo } from 'react';
import { Post } from '../services/api';

export function timeDifference(timestampInMs: number, locale: string = 'en-US') {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const current = Date.now();
  const elapsed = current - timestampInMs;

  if (elapsed < msPerMinute) {
    return `${Math.floor(elapsed / 1000)}s ago`;
  } else if (elapsed < msPerHour) {
    return `${Math.floor(elapsed / msPerMinute)}m ago`;
  } else if (elapsed < msPerDay) {
    return `${Math.floor(elapsed / msPerHour)}h ago`;
  } else if (elapsed < msPerMonth) {
    return `${Math.floor(elapsed / msPerDay)}d ago`;
  } else if (elapsed < msPerYear) {
    const value = Math.floor(elapsed / msPerMonth);
    return `${value} month${value > 1 ? 's' : ''} ago`;
  } else {
    return new Date(timestampInMs).toLocaleDateString(locale);
  }
}

export function getPreviewImageFromYoutube(url: string, media: any): string {
  // input: https://www.youtube.com/watch?v=cTyy0kgQ8Ug
  // output: https://i.ytimg.com/vi/cTyy0kgQ8Ug/maxresdefault.jpg

  if (media && media.type === 'youtube.com' && media.oembed.thumbnail_url) {
    return media.oembed.thumbnail_url;
  }

  const parsed = queryString.parseUrl(url);
  const ytID = parsed.query.v;
  return `https://i.ytimg.com/vi/${ytID}/maxresdefault.jpg`;
}

export function getVideoUrlFromDubz(url: string): string {
  // input: https://dubz.co/c/4beba4
  // output: https://squeelab.com/storage/videos/4beba4-1.mp4
  const parsed = url.split('/')[url.split('/').length - 1];
  const videoId = parsed;
  return `https://squeelab.com/storage/videos/${videoId}.mp4`;
}

// TODO - DISABLING FOR NOW
export function getPreviewImageFromDubz(url: string): string {
  // input: https://dubz.co/c/c4c1c3
  // output: https://dubz.co/thumbs/c4c1c3.jpg

  const parsed = url.split('/')[url.split('/').length - 1];
  const videoId = parsed;
  return `https://dubz.co/thumbs/${videoId}.jpg`;
}

export function getPreviewImageFromStreaminMe(url: string): string {
  // input: https://streamin.one/v/314a40fa
  // output: https://streamin.me/images/314a40fa.jpg

  const parsed = url.split('/')[url.split('/').length - 1];
  const videoId = parsed;
  return `https://streamin.me/images/${videoId}.jpg`;
}

export function useGalleryData(
  galleryData: Post['data']['gallery_data'],
  mediaMetadata: Post['data']['media_metadata']
): [null, null] | [{ x: number; y: number; u: string }[], (string | null)[]] {
  const values: [null, null] | [{ x: number; y: number; u: string }[], (string | null)[]] =
    useMemo(() => {
      if (!galleryData || !mediaMetadata) return [null, null];
      const metadata = mediaMetadata;
      const mediaIds = galleryData.items.map((it) => it.media_id);
      const galeryWithAllResolutions = mediaIds.map((mediaId) => metadata[mediaId].p);
      const galleryCaptions = galleryData.items.map((it) => it.caption ?? null);
      return [
        galeryWithAllResolutions
          .filter((res) => res)
          .map((allResolutions) => allResolutions[allResolutions.length - 1])
          .filter((res) => res),
        galleryCaptions,
      ];
    }, [galleryData]);
  return values;
}
