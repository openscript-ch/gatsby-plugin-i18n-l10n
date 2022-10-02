import { GatsbySSR } from 'gatsby';
import { SitePageContext, Translation } from '../types';

export const onRenderBody: GatsbySSR['onRenderBody'] = ({ loadPageDataSync, pathname, setHtmlAttributes, setHeadComponents }, options) => {
  // loadPageDataSync is not implemented in all run modes like development
  if (!loadPageDataSync) {
    return;
  }

  const {
    result: { pageContext },
  } = loadPageDataSync(pathname) as { result: { pageContext: SitePageContext } };
  const locale = pageContext.locale ?? (options.defaultLocale as string);
  const siteUrl = new URL(options.siteUrl as string);
  const translations = (pageContext.translations as Translation[]) || [];

  setHtmlAttributes({ lang: locale });
  setHeadComponents([
    <link rel="alternate" hrefLang="x-default" href={siteUrl.href} />,
    <link rel="alternate" hrefLang={locale} href={new URL(pathname, siteUrl).href} />,
    <meta property="og:locale" content={locale.replace(`-`, `_`)} />,
    ...translations.map((t) => [
      <link key={t.locale} rel="alternate" hrefLang={t.locale} href={new URL(t.path, siteUrl).href} />,
      <meta key={t.locale} property="og:locale:alternate" content={t.locale.replace(`-`, `_`)} />,
    ]),
  ]);
};
