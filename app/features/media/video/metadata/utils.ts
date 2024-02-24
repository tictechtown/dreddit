/*
 * validates the url
 * @param string var - the url we want to scrape
 */
export const isUrlValid = (url: string) => typeof url === 'string' && url.length > 0;

/*
 * forces url to start with http://
 * @param string var - the url we want to scrape
 */
const coerceUrl = (url: string) => (/^(f|ht)tps?:\/\//i.test(url) ? url : `http://${url}`);

/*
 * validate timeout - how long should we wait for a request
 * @param number var - the time we want to wait
 */
const isTimeoutValid = (timeout: number) =>
  typeof timeout === 'number' && /^\d{1,10}$/.test(`${timeout}`);

/*
 * validates url and timeout
 * @param string var - user input url and timeout
 */
export const validate = (url: string, timeout: number) => ({
  url: isUrlValid(url) ? coerceUrl(url) : null,
  timeout: isTimeoutValid(timeout) ? timeout : 2000,
});

/*
 * findImageTypeFromUrl
 * @param string url - image url
 */
export const findImageTypeFromUrl = (url: string) => {
  let type = url.split('.').pop() ?? '';
  [type] = type.split('?');
  return type;
};

/*
 * isImageTypeValid
 * @param string type - image type
 */
export const isImageTypeValid = (type: string) => {
  const validImageTypes = [
    'apng',
    'bmp',
    'gif',
    'ico',
    'cur',
    'jpg',
    'jpeg',
    'jfif',
    'pjpeg',
    'pjp',
    'png',
    'svg',
    'tif',
    'tiff',
    'webp',
  ];
  return validImageTypes.includes(type);
};

/*
 * isThisANonHTMLPage
 * @param string url - url of site
 */
export const isThisANonHTMLUrl = (url: string) => {
  const invalidImageTypes = [
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.3gp',
    '.avi',
    '.mov',
    '.mp4',
    '.m4v',
    '.m4a',
    '.mp3',
    '.mkv',
    '.ogv',
    '.ogm',
    '.ogg',
    '.oga',
    '.webm',
    '.wav',
    '.bmp',
    '.gif',
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.zip',
    '.rar',
    '.tar',
    '.tar.gz',
    '.tgz',
    '.tar.bz2',
    '.tbz2',
    '.txt',
    '.pdf',
  ];
  const extension = findImageTypeFromUrl(url);
  return invalidImageTypes.some((type) => `.${extension}`.includes(type));
};

/*
 * removeNestedUndefinedValues
 * @param object object - an object
 */
export const removeNestedUndefinedValues = (object: Record<string, any>) => {
  Object.entries(object).forEach(([key, value]) => {
    if (value && typeof value === 'object') removeNestedUndefinedValues(value);
    else if (value === undefined) delete object[key];
  });
  return object;
};
