/* eslint-disable max-len */
import fields from './fields';

const mediaMapperTwitterImage = (item: [string, number, number, string]) => ({
  url: item[0],
  width: item[1],
  height: item[2],
  alt: item[3],
});

const mediaMapperTwitterPlayer = (item: [string, number, number, string]) => ({
  url: item[0],
  width: item[1],
  height: item[2],
  stream: item[3],
});

const mediaMapperMusicSong = (item: [string, string, string]) => ({
  url: item[0],
  track: item[1],
  disc: item[2],
});

const mediaMapper = (item: [string, number, number, string]) => ({
  url: item[0],
  width: item[1],
  height: item[2],
  type: item[3],
});

const mediaSorter = (
  a: { url: string; width: number; height: number },
  b: { url: string; width: number; height: number },
): number => {
  if (!(a.url && b.url)) {
    return 0;
  }

  const aRes = a.url.match(/\.(\w{2,5})$/);
  const aExt = (aRes && aRes[1].toLowerCase()) || undefined;
  const bRes = b.url.match(/\.(\w{2,5})$/);
  const bExt = (bRes && bRes[1].toLowerCase()) || undefined;

  if (aExt === 'gif' && bExt !== 'gif') {
    return -1;
  }
  if (aExt !== 'gif' && bExt === 'gif') {
    return 1;
  }
  return Math.max(b.width, b.height) - Math.max(a.width, a.height);
};

const mediaSorterMusicSong = (
  a: { track?: string; disc: string },
  b: { track?: string; disc: string },
) => {
  if (!(a.track && b.track)) {
    return 0;
  }
  if (a.disc > b.disc) {
    return 1;
  }
  if (a.disc < b.disc) {
    return -1;
  }
  // @ts-ignore
  return a.track - b.track;
};

// lodash zip replacement
const zip = (array: unknown[], ...args: any[]) => {
  if (array === undefined) {
    return [];
  }
  return array.map((value, idx) => [value, ...args.map((arr) => arr[idx])]);
};

/*
 * media setup
 * @param string ogObject - return open open graph info
 * @param string options - options the user has set
 * @param function callback
 */
export const mediaSetup = (
  ogObject: Record<string, any>,
  options: {
    allMedia?: boolean;
    allVideos?: boolean;
    defaultMedia?: boolean;
    customMediaOnly?: boolean;
  },
) => {
  // sets ogImage image/width/height/type to null if one these exists
  if (
    ogObject.ogImage ||
    ogObject.ogImageWidth ||
    ogObject.twitterImageHeight ||
    ogObject.ogImageType
  ) {
    ogObject.ogImage = ogObject.ogImage ? ogObject.ogImage : [undefined];
    ogObject.ogImageWidth = ogObject.ogImageWidth ? ogObject.ogImageWidth : [undefined];
    ogObject.ogImageHeight = ogObject.ogImageHeight ? ogObject.ogImageHeight : [undefined];
    ogObject.ogImageType = ogObject.ogImageType ? ogObject.ogImageType : [undefined];
  }

  // format images
  const ogImages = zip(
    ogObject.ogImage,
    ogObject.ogImageWidth,
    ogObject.ogImageHeight,
    ogObject.ogImageType,
  )
    // @ts-ignore
    .map(mediaMapper)
    .sort(mediaSorter);

  // sets ogVideo video/width/height/type to null if one these exists
  if (ogObject.ogVideo || ogObject.ogVideoWidth || ogObject.ogVideoHeight || ogObject.ogVideoType) {
    ogObject.ogVideo = ogObject.ogVideo ? ogObject.ogVideo : [undefined];
    ogObject.ogVideoWidth = ogObject.ogVideoWidth ? ogObject.ogVideoWidth : [undefined];
    ogObject.ogVideoHeight = ogObject.ogVideoHeight ? ogObject.ogVideoHeight : [undefined];
    ogObject.ogVideoType = ogObject.ogVideoType ? ogObject.ogVideoType : [undefined];
  }

  // format videos
  const ogVideos = zip(
    ogObject.ogVideo,
    ogObject.ogVideoWidth,
    ogObject.ogVideoHeight,
    ogObject.ogVideoType,
  )
    // @ts-ignore
    .map(mediaMapper)
    .sort(mediaSorter);

  // sets twitter image image/width/height/type to null if one these exists
  if (
    ogObject.twitterImageSrc ||
    ogObject.twitterImage ||
    ogObject.twitterImageWidth ||
    ogObject.twitterImageHeight ||
    ogObject.twitterImageAlt
  ) {
    ogObject.twitterImageSrc = ogObject.twitterImageSrc ? ogObject.twitterImageSrc : [undefined];
    ogObject.twitterImage = ogObject.twitterImage
      ? ogObject.twitterImage
      : ogObject.twitterImageSrc; // deafult to twitterImageSrc
    ogObject.twitterImageWidth = ogObject.twitterImageWidth
      ? ogObject.twitterImageWidth
      : [undefined];
    ogObject.twitterImageHeight = ogObject.twitterImageHeight
      ? ogObject.twitterImageHeight
      : [undefined];
    ogObject.twitterImageAlt = ogObject.twitterImageAlt ? ogObject.twitterImageAlt : [undefined];
  }

  // format twitter images
  const twitterImages = zip(
    ogObject.twitterImage,
    ogObject.twitterImageWidth,
    ogObject.twitterImageHeight,
    ogObject.twitterImageAlt,
  )
    // @ts-ignore
    .map(mediaMapperTwitterImage)
    .sort(mediaSorter);

  // sets twitter player/width/height/stream to null if one these exists
  if (
    ogObject.twitterPlayer ||
    ogObject.twitterPlayerWidth ||
    ogObject.twitterPlayerHeight ||
    ogObject.twitterPlayerStream
  ) {
    ogObject.twitterPlayer = ogObject.twitterPlayer ? ogObject.twitterPlayer : [undefined];
    ogObject.twitterPlayerWidth = ogObject.twitterPlayerWidth
      ? ogObject.twitterPlayerWidth
      : [undefined];
    ogObject.twitterPlayerHeight = ogObject.twitterPlayerHeight
      ? ogObject.twitterPlayerHeight
      : [undefined];
    ogObject.twitterPlayerStream = ogObject.twitterPlayerStream
      ? ogObject.twitterPlayerStream
      : [undefined];
  }

  // format twitter player
  const twitterPlayers = zip(
    ogObject.twitterPlayer,
    ogObject.twitterPlayerWidth,
    ogObject.twitterPlayerHeight,
    ogObject.twitterPlayerStream,
  )
    // @ts-ignore
    .map(mediaMapperTwitterPlayer)
    .sort(mediaSorter);

  // sets music song/songTrack/songDisc to null if one these exists
  if (ogObject.musicSong || ogObject.musicSongTrack || ogObject.musicSongDisc) {
    ogObject.musicSong = ogObject.musicSong ? ogObject.musicSong : [undefined];
    ogObject.musicSongTrack = ogObject.musicSongTrack ? ogObject.musicSongTrack : [undefined];
    ogObject.musicSongDisc = ogObject.musicSongDisc ? ogObject.musicSongDisc : [undefined];
  }

  // format music songs
  const musicSongs = zip(ogObject.musicSong, ogObject.musicSongTrack, ogObject.musicSongDisc)
    // @ts-ignore
    .map(mediaMapperMusicSong)
    .sort(mediaSorterMusicSong);

  // remove old values since everything will live under the main property
  fields
    .filter(
      (item) =>
        item.multiple &&
        item.fieldName &&
        item.fieldName.match('(ogImage|ogVideo|twitter|musicSong).*'),
    )
    .forEach((item) => {
      delete ogObject[item.fieldName];
    });

  if (options.allMedia) {
    if (ogImages.length) {
      ogObject.ogImage = ogImages;
    }
    if (ogVideos.length) {
      ogObject.ogVideo = ogVideos;
    }
    if (twitterImages.length) {
      ogObject.twitterImage = twitterImages;
    }
    if (twitterPlayers.length) {
      ogObject.twitterPlayer = twitterPlayers;
    }
    if (musicSongs.length) {
      ogObject.musicSong = musicSongs;
    }
  } else {
    if (ogImages.length) {
      [ogObject.ogImage] = ogImages;
    }
    if (ogVideos.length) {
      [ogObject.ogVideo] = ogVideos;
    }
    if (twitterImages.length) {
      [ogObject.twitterImage] = twitterImages;
    }
    if (twitterPlayers.length) {
      [ogObject.twitterPlayer] = twitterPlayers;
    }
    if (musicSongs.length) {
      [ogObject.musicSong] = musicSongs;
    }
  }

  return ogObject;
};
