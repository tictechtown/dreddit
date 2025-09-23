import { useMemo } from 'react';
import type { Post } from '@services/api';

type GaleryData =
  | [undefined, undefined]
  | [{ x: number; y: number; u: string }[], (string | undefined)[]];

export default function useGalleryData(
  galleryData: Post['data']['gallery_data'],
  mediaMetadata: Post['data']['media_metadata'],
): GaleryData {
  const values: GaleryData = useMemo(() => {
    if (!galleryData || !mediaMetadata) {
      return [undefined, undefined];
    }
    const metadata = mediaMetadata;
    const mediaIds = galleryData.items.map((it) => it.media_id);
    const galeryWithAllResolutions = mediaIds.map((mediaId) => metadata[mediaId].p);
    const galleryCaptions = galleryData.items.map((it) => it.caption ?? undefined);
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
