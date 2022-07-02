import { posix as nodePath } from 'path';
import { PluginOptions } from '../../types';

export const trimRightSlash = (path: string) => {
  return path === '/' ? path : path.replace(/\/$/, '');
};

export const trimSlashes = (path: string) => {
  return path === '/' ? path : path.replace(/^\/|\/$/g, '');
};

export const addLocalePrefix = (currentPath: string, locale: string, prefix: string, defaultLocale: string) => {
  return locale !== defaultLocale ? trimRightSlash(`/${nodePath.join(prefix, currentPath)}`) : currentPath;
};

export const translatePagePaths = (path: string, options: PluginOptions) => {
  return options.locales.map((locale) => {
    const trimmedPath = trimRightSlash(path);
    const newPath = locale.slugs[trimmedPath] ?? trimmedPath;

    return { locale: locale.locale, path: addLocalePrefix(newPath, locale.locale, locale.prefix, options.defaultLocale) };
  });
};

export const parsePathPrefix = (path: string, defaultPrefix: string) => {
  if (path === '/') {
    return defaultPrefix;
  }

  // Regex literals are evaluated when the script is loaded, whereas the RegExp instantiation is done when it's reached during execution. Safari doesn't support look behinds, which causes an error when the script is loaded. This is only needed in SSG.
  // eslint-disable-next-line prefer-regex-literals
  const splitPathExpression = new RegExp('(?<=^/)\\w{2}(-\\w{2})?(?=/)', 'g');
  const splittedPath = path.match(splitPathExpression);
  return splittedPath && splittedPath[0] ? splittedPath[0] : defaultPrefix;
};

export const generatePageContext = (path: string, options: PluginOptions) => {
  const defaultPrefix = options.locales.find((l) => l.locale === options.defaultLocale)?.prefix;
  const parsedPrefix = parsePathPrefix(path, defaultPrefix ?? '');
  const locale = options.locales.find((l) => l.prefix === parsedPrefix);

  return { locale: locale?.locale, prefix: locale?.prefix };
};
