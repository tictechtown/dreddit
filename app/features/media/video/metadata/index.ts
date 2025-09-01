// const cheerio = require('cheerio');
import * as cheerio from 'cheerio';
import fallback from './fallback';
import fields from './fields';
import { mediaSetup } from './media';
import { removeNestedUndefinedValues } from './utils';

/*
 * extract meta tags from html string
 * @param string body - html string
 * @param string options - options the user has set
 */
export const extractMetaTags = (
  body: string,
  options: {
    onlyGetOpenGraphInfo?: boolean;
    allMedia?: boolean;
    customMetaTags: { multiple: false; property: 'og:type'; fieldName: 'ogType' }[];
  }
): Record<string, any> => {
  let ogObject: Record<string, any> = {};
  const $ = cheerio.load(body);
  const metaFields = fields.concat(options.customMetaTags);

  // find all of the open graph info in the meta tags
  $('meta').each((index, meta) => {
    if (!meta.attribs || (!meta.attribs.property && !meta.attribs.name)) return;
    const property = meta.attribs.property || meta.attribs.name;
    const content = meta.attribs.content || meta.attribs.value;
    metaFields.forEach((item) => {
      if (property.toLowerCase() === item.property.toLowerCase()) {
        if (!item.multiple) {
          ogObject[item.fieldName] = content;
        } else if (!ogObject[item.fieldName]) {
          ogObject[item.fieldName] = [content];
        } else if (Array.isArray(ogObject[item.fieldName])) {
          ogObject[item.fieldName].push(content);
        }
      }
    });
  });

  // set ogImage to ogImageSecureURL/ogImageURL if there is no ogImage
  if (!ogObject.ogImage && ogObject.ogImageSecureURL) {
    ogObject.ogImage = ogObject.ogImageSecureURL;
  } else if (!ogObject.ogImage && ogObject.ogImageURL) {
    ogObject.ogImage = ogObject.ogImageURL;
  }

  // formats the multiple media values
  ogObject = mediaSetup(ogObject, options);

  // if onlyGetOpenGraphInfo isn't set, run the open graph fallbacks
  if (!options.onlyGetOpenGraphInfo) {
    ogObject = fallback(ogObject, options, $);
  }

  // removes any undefs
  ogObject = removeNestedUndefinedValues(ogObject);

  return ogObject;
};
