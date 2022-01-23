import path from 'path';
import { PluginOptions } from '../../types';

export const trimRightSlash = (path: string) => {
  return path === '/' ? path : path.replace(/\/$/, '');
};

export const trimSlashes = (path: string) => {
  return path === '/' ? path : path.replace(/^\/|\/$/g, '');
};

export const addLocalePrefix = (currentPath: string, locale: string, prefix: string, defaultLocale: string) => {
  return locale !== defaultLocale ? trimRightSlash(`/${path.join(prefix, currentPath)}`) : currentPath;
};

export const translatePagePaths = (path: string, options: PluginOptions) => {
  return options.locales.map(locale => {
    const trimmedPath = trimRightSlash(path);
    const newPath = locale.slugs[trimmedPath] ?? trimmedPath;

    return { locale: locale.locale, path: addLocalePrefix(newPath, locale.locale, locale.prefix, options.defaultLocale) };
  });
};

export const parsePathPrefix = (path: string, defaultPrefix: string) => {
  if (path === '/') {
    return defaultPrefix;
  }

  const splittedPath = path.match(/(?<=^\/)\w{2}(\-\w{2})?(?=\/)/g);
  return splittedPath && splittedPath[0] ? splittedPath[0] : defaultPrefix;
};

export const generatePageContext = (path: string, options: PluginOptions) => {
  const defaultPrefix = options.locales.find(l => l.locale === options.defaultLocale)?.prefix;
  const parsedPrefix = parsePathPrefix(path, defaultPrefix ?? '');
  const locale = options.locales.find(l => l.prefix === parsedPrefix);

  return { locale: locale?.locale, prefix: locale?.prefix };
};
