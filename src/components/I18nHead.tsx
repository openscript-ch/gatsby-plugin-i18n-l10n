import path from 'path';
import { Helmet } from 'react-helmet';
import { Translation } from '../../types';

type I18nHeadProps = {
  currentLocale: string;
  pathname: string;
  siteUrl: string;
  translations: Translation[];
};

export default function I18nHead({ currentLocale, translations, siteUrl, pathname }: I18nHeadProps) {
  return (
    <Helmet>
      <html lang={currentLocale} />
      <link rel="alternate" hrefLang="x-default" href={siteUrl} />
      <link rel="alternate" hrefLang={currentLocale} href={path.join(siteUrl, pathname)} />
      {translations.map((t) => (
        <link key={t.locale} rel="alternate" hrefLang={t.locale} href={path.join(siteUrl, t.path)} />
      ))}
      <meta property="og:locale" content={currentLocale.replace(`-`, `_`)} />
      {translations.map((t) => (
        <meta key={t.locale} property="og:locale:alternate" content={t.locale.replace(`-`, `_`)} />
      ))}
    </Helmet>
  );
}
