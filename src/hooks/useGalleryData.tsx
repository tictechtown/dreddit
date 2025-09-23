import { useMemo } from 'react';
import { Post } from '@services/api';

export default function useGalleryData(
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
