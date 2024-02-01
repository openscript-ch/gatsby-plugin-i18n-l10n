import { posix as nodePath } from 'path';
import { PluginOptions } from 'gatsby';

const ERROR_PAGE_PATH_PATTERN = /[0-9]{3}\.([0-9a-z]+)(?:[?#]|$)/gim;

export const handleTrailingSlash = (path: string, trailingSlashOption: PluginOptions['trailingSlash'] = 'always') => {
  if (path === '/' || path.length < 1 || path.match(ERROR_PAGE_PATH_PATTERN)) {
    return path;
  }

  const hasTrailingSlash = path.endsWith('/');

  switch (trailingSlashOption) {
    case 'always':
      return hasTrailingSlash ? path : `${path}/`;
    case 'never':
      return hasTrailingSlash ? path.slice(0, -1) : path;
    default:
      return path;
  }
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
  return locale !== defaultLocale ? `/${nodePath.join(prefix, path)}` : path;
};

export const translatePagePath = (
  path: string,
  slugs: Record<string, string>,
  locale: string,
  prefix: string,
  defaultLocale: string,
  options: PluginOptions,
) => {
  let translatedPath = path;

  translatedPath = replaceSegmentsWithSlugs(translatedPath, slugs);
  translatedPath = addLocalePrefix(translatedPath, locale, prefix, defaultLocale);
  translatedPath = handleTrailingSlash(translatedPath, options.trailingSlash);

  return translatedPath;
};

export const translatePagePaths = (path: string, options: PluginOptions) => {
  return options.locales.map((locale) => {
    const trimmedPath = handleTrailingSlash(path, options.trailingSlash);
    let translatedPath = locale.slugs[trimmedPath] ?? trimmedPath;
    translatedPath = addLocalePrefix(translatedPath, locale.locale, locale.prefix, options.defaultLocale);
    translatedPath = handleTrailingSlash(translatedPath, options.trailingSlash);

    return { locale: locale.locale, path: translatedPath };
  });
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
