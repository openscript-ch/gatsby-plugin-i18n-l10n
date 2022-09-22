import { OnRenderBody, SitePageContext, Translation } from '../types';

export const onRenderBody: OnRenderBody = ({ loadPageDataSync, pathname, setHtmlAttributes, setHeadComponents }, options) => {
  const {
    result: { pageContext },
  } = loadPageDataSync(pathname) as { result: { pageContext: SitePageContext } };
  const locale = pageContext.locale ?? options.defaultLocale;
  const { siteUrl } = options;
  const siteUrlInstance = new URL(siteUrl);
  const translations = (pageContext.translations as Translation[]) || [];

  setHtmlAttributes({ lang: locale });
  setHeadComponents([
    <link rel="alternate" hrefLang="x-default" href={siteUrlInstance.href} />,
    <link rel="alternate" hrefLang={locale} href={new URL(pathname, siteUrlInstance).href} />,
    <meta property="og:locale" content={locale.replace(`-`, `_`)} />,
    ...translations.map((t) => [
      <link key={t.locale} rel="alternate" hrefLang={t.locale} href={new URL(t.path, siteUrlInstance).href} />,
      <meta key={t.locale} property="og:locale:alternate" content={t.locale.replace(`-`, `_`)} />,
    ]),
  ]);
};
