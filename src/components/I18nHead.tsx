import { Helmet } from 'react-helmet';
import { Translation } from '../../types';

type I18nHeadProps = {
  currentLocale: string;
  pathname: string;
  siteUrl: string;
  translations: Translation[];
  defaultLocale: string;
};

export default function I18nHead({ currentLocale, translations, siteUrl, pathname, defaultLocale }: I18nHeadProps) {
  return (
    <Helmet>
      <html lang={currentLocale} />
      <link rel="alternate" hrefLang="x-default" href={siteUrl} />
      {defaultLocale !== currentLocale && <link rel="alternate" hrefLang={currentLocale} href={`${siteUrl}${pathname}`} />}
      {translations
        .filter((t) => t.locale !== `${defaultLocale}`)
        .map((t) => (
          <link key={t.locale} rel="alternate" hrefLang={t.locale} href={`${siteUrl}${t.path}`} />
        ))}
      <meta property="og:locale" content={currentLocale.replace(`-`, `_`)} />
      {translations.map((t) => (
        <meta key={t.locale} property="og:locale:alternate" content={t.locale.replace(`-`, `_`)} />
      ))}
    </Helmet>
  );
}
