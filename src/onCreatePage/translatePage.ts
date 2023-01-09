import { CreatePageArgs, PluginOptions } from 'gatsby';
import { SitePageContext, UnstatefulSitePageContext } from '../../types';
import { createLocalePagesId } from '../utils/i18n';
import { generatePageContextByPath, translatePagePath, translatePagePaths } from '../utils/path';

export const translatePage = async ({ page, actions }: CreatePageArgs<SitePageContext>, options: PluginOptions) => {
  const { createPage, deletePage } = actions;

  // If this page was already translated, we skip it.
  if (page.context?.locale && page.context.localePagesId) {
    return;
  }

  // Translate statefully created pages from `/src/pages` or gatsby-plugin-page-creator
  if (options && page.isCreatedByStatefulCreatePages) {
    const paths = translatePagePaths(page.path, options);

    deletePage(page);

    paths.forEach((path) => {
      const translations = paths.filter((p) => p.locale !== path.locale);
      const locale = options.locales.find((l) => l.locale === path.locale);
      const context = {
        ...page.context,
        locale: path.locale,
        localePagesId: createLocalePagesId(page.path),
        translations,
        prefix: locale?.prefix,
      };

      createPage({ ...page, path: path.path, context });
    });
  }

  // Translate programmically generated pages
  if (options && !page.isCreatedByStatefulCreatePages) {
    deletePage(page);

    const { referTranslations, adjustPath, ...restContext } = (page.context as UnstatefulSitePageContext) || {};
    let context = restContext;
    let path = (context.basePath as string) || page.path;

    // Add locale, localePagesId and prefix from context or path
    const contextLocale = page.context?.locale as string | undefined;
    let optionsLocale = options.locales.find((l) => l.locale === contextLocale);
    const localeAndPrefixContext = optionsLocale
      ? { locale: optionsLocale.locale, prefix: optionsLocale.prefix }
      : generatePageContextByPath(path, options);
    context = { ...context, ...localeAndPrefixContext, localePagesId: createLocalePagesId(page.path, localeAndPrefixContext.prefix) };
    optionsLocale = options.locales.find((l) => l.locale === localeAndPrefixContext.locale);

    // Refer translations if requested
    if (referTranslations && Array.isArray(referTranslations) && referTranslations.length > 0) {
      const translations = translatePagePaths(path, options).filter(
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
