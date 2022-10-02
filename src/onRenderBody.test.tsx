import { onRenderBody } from './onRenderBody';

describe('onRenderBody', () => {
  it('should not run, if loadPageDataSync is not available', () => {
    const setHtmlAttributesMock = jest.fn();
    const setHeadComponentsMock = jest.fn();

    if (onRenderBody) {
      onRenderBody(
        {
          loadPageDataSync: undefined,
          setHtmlAttributes: setHtmlAttributesMock,
          setHeadComponents: setHeadComponentsMock,
        } as any,
        {} as any,
      );
    }

    expect(setHtmlAttributesMock).toBeCalledTimes(0);
    expect(setHeadComponentsMock).toBeCalledTimes(0);
  });
  it('should set i18n meta data', () => {
    const loadPageDataSyncMock = jest.fn().mockImplementation(() => ({
      result: {
        pageContext: {
          locale: 'de-CH',
          translations: [
            { locale: 'en-US', path: '/imprint' },
            { locale: 'fr-FR', path: '/fr/imprimer' },
          ],
        },
      },
    }));
    const setHtmlAttributesMock = jest.fn();
    const setHeadComponentsMock = jest.fn();

    if (onRenderBody) {
      onRenderBody(
        {
          loadPageDataSync: loadPageDataSyncMock,
          pathname: '/de/impressum',
          setHtmlAttributes: setHtmlAttributesMock,
          setHeadComponents: setHeadComponentsMock,
        } as any,
        {
          defaultLocale: 'en-US',
          siteUrl: 'https://example.com',
        } as any,
      );
    }

    expect(setHtmlAttributesMock).toBeCalledWith({ lang: 'de-CH' });
    expect(setHeadComponentsMock).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": [
          [
            [
              <link
                href="https://example.com/"
                hrefLang="x-default"
                rel="alternate"
              />,
              <link
                href="https://example.com/de/impressum"
                hrefLang="de-CH"
                rel="alternate"
              />,
              <meta
                content="de_CH"
                property="og:locale"
              />,
              [
                <link
                  href="https://example.com/imprint"
                  hrefLang="en-US"
                  rel="alternate"
                />,
                <meta
                  content="en_US"
                  property="og:locale:alternate"
                />,
              ],
              [
                <link
                  href="https://example.com/fr/imprimer"
                  hrefLang="fr-FR"
                  rel="alternate"
                />,
                <meta
                  content="fr_FR"
                  property="og:locale:alternate"
                />,
              ],
            ],
          ],
        ],
        "results": [
          {
            "type": "return",
            "value": undefined,
          },
        ],
      }
    `);
  });
});
