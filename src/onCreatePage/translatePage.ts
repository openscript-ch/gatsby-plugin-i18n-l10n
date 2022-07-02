import { OnCreatePage } from '../../types';
import { generatePageContextByPath, translatePagePaths } from '../utils/path';

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

    const contextLocale = page.context.locale as string | undefined;
    const optionsLocale = options.locales.find((l) => l.locale === contextLocale);

    const generatedPageContext = optionsLocale
      ? { locale: optionsLocale.locale, prefix: optionsLocale.prefix }
      : generatePageContextByPath(page.path, options);
    const context = { ...page.context, ...generatedPageContext };

    createPage({ ...page, context });
  }
};
