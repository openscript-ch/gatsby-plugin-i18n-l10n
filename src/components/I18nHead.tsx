import { Helmet } from 'react-helmet';
import { Translation } from '../../types';

type I18nHeadProps = {
  currentLocale: string;
  pathname: string;
  siteUrl: string;
  translations: Translation[];
};

/**
 * This components sets meta elements related to internationalization to the document head.
 *
 * @param see I18nHeadProps
 * @returns some meta elements to the document head
 * @see https://developers.google.com/search/docs/advanced/crawling/localized-versions
 * @see https://ogp.me/
 */
export default function I18nHead({ currentLocale, translations, siteUrl, pathname }: I18nHeadProps) {
  const siteUrlInstance = new URL(siteUrl);
  return (
    <Helmet>
      <html lang={currentLocale} />
      <link rel="alternate" hrefLang="x-default" href={siteUrlInstance.href} />
      <link rel="alternate" hrefLang={currentLocale} href={new URL(pathname, siteUrlInstance).href} />
      <meta property="og:locale" content={currentLocale.replace(`-`, `_`)} />
      {translations.map((t) => [
        <link key={t.locale} rel="alternate" hrefLang={t.locale} href={new URL(t.path, siteUrlInstance).href} />,
        <meta key={t.locale} property="og:locale:alternate" content={t.locale.replace(`-`, `_`)} />,
      ])}
    </Helmet>
  );
}
