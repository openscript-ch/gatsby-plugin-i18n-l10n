import { cleanup, render } from '@testing-library/react';
import { PluginOptions } from 'gatsby';
import { wrapPageElement } from './wrapPageElement';

describe('wrapPageElement', () => {
  afterEach(cleanup);

  const options: PluginOptions = {
    defaultLocale: `en-US`,
    siteUrl: 'https://example.com',
    locales: [
      {
        locale: `en-US`,
        prefix: `en`,
        slugs: {},
        messages: {},
      },
      {
        locale: `de-CH`,
        prefix: `de`,
        slugs: {
          '/imprint': '/impressum',
        },
        messages: {},
      },
      {
        locale: `fr-FR`,
        prefix: `fr`,
        slugs: {
          '/imprint': '/imprimer',
        },
        messages: {},
      },
    ],
    plugins: [],
  };

  it('setup the providers of this plugin', async () => {
    const element = <div>Child</div>;
    const props: any = {
      pageContext: {
        translations: [
          { locale: 'en-US', path: '/imprint' },
          { locale: 'fr-FR', path: '/fr/imprimer' },
        ],
      },
      location: {
        pathname: '/de/impressum',
      },
    };

    const component = render(<div>{wrapPageElement({ element, props }, options)}</div>);
    expect(component.queryAllByText(/Child/)).toBeTruthy();
  });

  it('setup the providers of this plugin without translations', async () => {
    const element = <div>Child</div>;
    const props: any = {
      pageContext: {
        translations: undefined,
      },
      location: {
        pathname: '/de/impressum',
      },
    };

    const component = render(<div>{wrapPageElement({ element, props }, options)}</div>);
    expect(component.queryAllByText(/Child/)).toBeTruthy();
  });
});
