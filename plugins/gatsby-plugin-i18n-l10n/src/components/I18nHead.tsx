import { graphql, useStaticQuery } from 'gatsby';
import path from 'path';
import { Helmet } from 'react-helmet';
import { Translation } from '../../types';

type I18nHeadProps = {
  currentLocale: string;
  pathname: string;
  translations: Translation[];
};

export default function I18nHead({ currentLocale, translations, pathname }: I18nHeadProps) {
  const data = useStaticQuery<{ site: { siteMetadata: { siteUrl: string } } }>(graphql`
    query I18nHeadQuery {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);
  console.log(data);

  return (
    <Helmet>
      <html lang={currentLocale} />
      <link rel="alternate" hrefLang="x-default" href={data.site.siteMetadata.siteUrl} />
      <link rel="alternate" hrefLang={currentLocale} href={path.join(data.site.siteMetadata.siteUrl, pathname)} />
      {translations.map(t => (
        <link key={t.locale} rel="alternate" hrefLang={t.locale} href={path.join(data.site.siteMetadata.siteUrl, t.path)} />
      ))}
      <meta property="og:locale" content={currentLocale.replace(`-`, `_`)} />
      {translations.map(t => (
        <meta key={t.locale} property="og:locale:alternate" content={t.locale.replace(`-`, `_`)} />
      ))}
    </Helmet>
  );
}
