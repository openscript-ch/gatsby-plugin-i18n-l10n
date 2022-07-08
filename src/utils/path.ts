import { posix as nodePath } from 'path';
import convertToSlug from 'limax';
import { PluginOptions } from '../../types';

export const trimRightSlash = (path: string) => {
  return path === '/' ? path : path.replace(/\/$/, '');
};

export const trimSlashes = (path: string) => {
  return path === '/' ? path : path.replace(/^\/|\/$/g, '');
};

export const replaceSegmentsWithSlugs = (path: string, slugs: Record<string, string>) => {
  const keys = Object.keys(slugs);
  if (keys.length > 0) {
    const exp = new RegExp(keys.join('|'), 'g');
    return path.replace(exp, (match) => slugs[match]);
  }
  return path;
};

export const addLocalePrefix = (path: string, locale: string, prefix: string, defaultLocale: string) => {
  return locale !== defaultLocale ? trimRightSlash(`/${nodePath.join(prefix, path)}`) : path;
};

export const translatePagePath = (path: string, slugs: Record<string, string>, locale: string, prefix: string, defaultLocale: string) => {
  let translatedPath = path;

  translatedPath = replaceSegmentsWithSlugs(translatedPath, slugs);
  translatedPath = addLocalePrefix(translatedPath, locale, prefix, defaultLocale);

  return translatedPath;
};

export const translatePagePaths = (path: string, options: PluginOptions) => {
  return options.locales.map((locale) => {
    const trimmedPath = trimRightSlash(path);
    const newPath = locale.slugs[trimmedPath] ?? trimmedPath;

    return { locale: locale.locale, path: addLocalePrefix(newPath, locale.locale, locale.prefix, options.defaultLocale) };
  });
};

/**
 * Translates paths based on filename, location, locale and plugin options
 *
 * @param filename of the designated file
 * @param relativeDirectory of the relative directory where the designated file resides in
 * @param locale of the designated file
 * @param options is the configuration of the current plugin instance
 * @param title which was read from frontmatter or elsewhere which belongs to this file
 * @returns a translated slug, a kind (relativeDirectory) and its filepath
 */
export const translatePath = (filename: string, relativeDirectory: string, locale: string, options: PluginOptions, title?: string) => {
  let slug = '';
  if (filename.indexOf('index') === -1) {
    slug = title ? convertToSlug(title) : filename;
  }

  // 'relativeDirectory' is a synonym of 'kind'
  const localeOption = options.locales.find((l) => l.locale === locale);
  const currentPath = nodePath.join('/', relativeDirectory, slug);

  // add locale prefix to path
  let filepath = addLocalePrefix(currentPath, locale, localeOption?.prefix || '', options.defaultLocale);

  // remove path segments which are on the path blacklist
  filepath = options.pathBlacklist?.reduce((prev, curr) => prev.replace(curr, ''), filepath) || filepath;

  // replace path segments with slugs
  if (localeOption) {
    filepath = replaceSegmentsWithSlugs(filepath, localeOption.slugs);
  }

  return { slug, kind: relativeDirectory, filepath };
};

export const parsePathPrefix = (path: string, defaultPrefix: string) => {
  if (path === '/') {
    return defaultPrefix;
  }

  // Regex literals are evaluated when the script is loaded,
  // whereas the RegExp instantiation is done when it's reached
  // during execution. Safari doesn't support look behinds,
  // which causes an error when the script is loaded. This is
  // only needed in SSG.
  // eslint-disable-next-line prefer-regex-literals
  const splitPathExpression = new RegExp('(?<=^/)\\w{2}(-\\w{2})?(?=/)', 'g');
  const splittedPath = path.match(splitPathExpression);
  return splittedPath && splittedPath[0] ? splittedPath[0] : defaultPrefix;
};

export const generatePageContextByPath = (path: string, options: PluginOptions) => {
  const defaultPrefix = options.locales.find((l) => l.locale === options.defaultLocale)?.prefix;
  const parsedPrefix = parsePathPrefix(path, defaultPrefix ?? '');
  const locale = options.locales.find((l) => l.prefix === parsedPrefix);

  return { locale: locale?.locale, prefix: locale?.prefix };
};
