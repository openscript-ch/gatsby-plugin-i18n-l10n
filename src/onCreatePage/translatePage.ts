import { OnCreatePage } from '../../types';
import { generatePageContextByPath, translatePagePath, translatePagePaths } from '../utils/path';

export const translatePage: OnCreatePage = async ({ page, actions }, options) => {
  const { createPage, deletePage } = actions;

  // Only for pages created by stateful create pages like `/src/pages`
  if (options && page.isCreatedByStatefulCreatePages) {
    const paths = translatePagePaths(page.path, options);

    deletePage(page);

    paths.forEach((path) => {
      const translations = paths.filter((p) => p.locale !== path.locale);
      const locale = options.locales.find((l) => l.locale === path.locale);
      const context = { ...page.context, locale: path.locale, translations, prefix: locale?.prefix };

      createPage({ ...page, path: path.path, context });
    });
  }

  if (options && !page.isCreatedByStatefulCreatePages) {
    deletePage(page);

    const { referTranslations, adjustPath, ...restContext } = page.context;
    let context = restContext;
    let path = (context.path as string) || page.path;

    // Add locale and prefix from context or path
    const contextLocale = page.context.locale as string | undefined;
    let optionsLocale = options.locales.find((l) => l.locale === contextLocale);
    const localeAndPrefixContext = optionsLocale
      ? { locale: optionsLocale.locale, prefix: optionsLocale.prefix }
      : generatePageContextByPath(page.path, options);
    context = { ...context, ...localeAndPrefixContext };
    optionsLocale = options.locales.find((l) => l.locale === localeAndPrefixContext.locale);

    // Refer translations if requested
    if (referTranslations && Array.isArray(referTranslations) && referTranslations.length > 0) {
      const translations = translatePagePaths(page.path, options).filter(
        (p) => p.locale !== localeAndPrefixContext.locale && referTranslations.includes(p.locale),
      );
      context = { ...context, translations };
    }

    // Translate page path if requested
    if (adjustPath && typeof context.locale === 'string' && typeof context.prefix === 'string' && optionsLocale) {
      path = translatePagePath(path, optionsLocale.slugs, context.locale, context.prefix, options.defaultLocale);
    }

    createPage({ ...page, context, path });
  }
};
