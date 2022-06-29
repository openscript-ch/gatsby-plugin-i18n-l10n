import { OnCreatePage } from '../../types';
import { generatePageContext, translatePagePaths } from '../utils/path';

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

    const paths = translatePagePaths(page.path, options);
    const locale = generatePageContext(page.path, options);
    const translations = paths.filter((p) => p.locale !== locale.locale);
    const context = { ...page.context, ...locale, translations };

    createPage({ ...page, context });
  }
};
