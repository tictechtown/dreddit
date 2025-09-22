import queryString from 'query-string';

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
