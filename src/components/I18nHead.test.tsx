import { cleanup, render } from '@testing-library/react';
import { Helmet } from 'react-helmet';
import { Translation } from '../../types';
import I18nHead from './I18nHead';

describe('<I18nHead />', () => {
  afterEach(cleanup);

  it('should render current language in lang attribute of the html tag', async () => {
    const currentLocale = 'de-CH';
    const translations: Translation[] = [
      { locale: 'en-GB', path: '/imprint' },
      { locale: 'fr-FR', path: '/fr/imprimer' },
    ];
    const siteUrl = 'https://example.com';
    const pathname = '/de/impressum';

    render(<I18nHead currentLocale={currentLocale} translations={translations} siteUrl={siteUrl} pathname={pathname} />);

    const helmet = Helmet.peek();

    expect(helmet.htmlAttributes).toEqual({ lang: 'de-CH' });
    expect(helmet.linkTags).toEqual([
      {
        rel: 'alternate',
        hrefLang: 'x-default',
        href: 'https://example.com/',
      },
      {
        rel: 'alternate',
        hrefLang: 'de-CH',
        href: 'https://example.com/de/impressum',
      },
      {
        rel: 'alternate',
        hrefLang: 'en-GB',
        href: 'https://example.com/imprint',
      },
      {
        rel: 'alternate',
        hrefLang: 'fr-FR',
        href: 'https://example.com/fr/imprimer',
      },
    ]);
    expect(helmet.metaTags).toEqual([
      { property: 'og:locale', content: 'de_CH' },
      { property: 'og:locale:alternate', content: 'en_GB' },
      { property: 'og:locale:alternate', content: 'fr_FR' },
    ]);
  });
});
