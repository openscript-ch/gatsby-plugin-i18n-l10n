import { Page, PluginOptions } from 'gatsby';
import { translatePage } from './translatePage';

const options: PluginOptions = {
  defaultLocale: `en-US`,
  siteUrl: '',
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
        '/pages/imprint': '/seiten/impressum',
      },
      messages: {},
      pageBlacklist: ['/do-not-translate-to-german'],
    },
    {
      locale: `zh-CN`,
      prefix: `zh`,
      slugs: {},
      messages: {},
    },
  ],
  plugins: [],
};

let actions: any;

describe('translatePage', () => {
  beforeEach(() => {
    actions = {
      createPage: jest.fn(),
      deletePage: jest.fn(),
    };
  });

  it('should translate stateful created pages', () => {
    const page: Page = {
      path: '/pages/imprint',
      component: {} as any,
      context: {},
      isCreatedByStatefulCreatePages: true,
    };
    translatePage({ page, actions } as any, options);

    expect(actions.deletePage).toHaveBeenCalledWith(page);
    expect(actions.createPage).toHaveBeenCalledTimes(3);
    expect(actions.createPage).toHaveBeenNthCalledWith(1, {
      ...page,
      context: {
        locale: 'en-US',
        prefix: 'en',
        localePagesId: 'pages.imprint',
        translations: [
          {
            locale: 'de-CH',
            path: '/de/seiten/impressum',
          },
          {
            locale: 'zh-CN',
            path: '/zh/pages/imprint',
          },
        ],
      },
    });
    expect(actions.createPage).toHaveBeenNthCalledWith(2, {
      ...page,
      context: {
        locale: 'de-CH',
        prefix: 'de',
        localePagesId: 'pages.imprint',
        translations: [
          {
            locale: 'en-US',
            path: '/pages/imprint',
          },
          {
            locale: 'zh-CN',
            path: '/zh/pages/imprint',
          },
        ],
      },
      path: '/de/seiten/impressum',
    });
    expect(actions.createPage).toHaveBeenNthCalledWith(3, {
      ...page,
      context: {
        locale: 'zh-CN',
        prefix: 'zh',
        localePagesId: 'pages.imprint',
        translations: [
          {
            locale: 'en-US',
            path: '/pages/imprint',
          },
          {
            locale: 'de-CH',
            path: '/de/seiten/impressum',
          },
        ],
      },
      path: '/zh/pages/imprint',
    });
  });

  it('should translate unstateful created pages by path with default language', () => {
    const page: Page = {
      path: '/imprint',
      component: {} as any,
      isCreatedByStatefulCreatePages: false,
    };
    translatePage({ page, actions } as any, options);

    expect(actions.deletePage).toHaveBeenCalledWith(page);
    expect(actions.createPage).toHaveBeenCalledTimes(1);
    expect(actions.createPage).toHaveBeenNthCalledWith(1, {
      ...page,
      context: {
        locale: 'en-US',
        prefix: 'en',
        localePagesId: 'imprint',
      },
    });
  });

  it('should translate unstateful created pages by prefix in path', () => {
    const page: Page = {
      path: '/de/imprint',
      component: {} as any,
      context: {},
      isCreatedByStatefulCreatePages: false,
    };
    translatePage({ page, actions } as any, options);

    expect(actions.deletePage).toHaveBeenCalledWith(page);
    expect(actions.createPage).toHaveBeenCalledTimes(1);
    expect(actions.createPage).toHaveBeenNthCalledWith(1, {
      ...page,
      context: {
        locale: 'de-CH',
        prefix: 'de',
        localePagesId: 'imprint',
      },
    });
  });

  it('should translate unstateful created pages by locale in context', () => {
    const page: Page = {
      path: '/imprint',
      component: {} as any,
      context: {
        locale: 'de-CH',
      },
      isCreatedByStatefulCreatePages: false,
    };
    translatePage({ page, actions } as any, options);

    expect(actions.deletePage).toHaveBeenCalledWith(page);
    expect(actions.createPage).toHaveBeenCalledTimes(1);
    expect(actions.createPage).toHaveBeenNthCalledWith(1, {
      ...page,
      context: {
        locale: 'de-CH',
        prefix: 'de',
        localePagesId: 'imprint',
      },
    });
  });

  it('should translate unstateful created pages and refer translations', () => {
    const page: Page = {
      path: '/imprint',
      component: {} as any,
      context: {
        locale: 'en-US',
        referTranslations: ['de-CH'],
      },
      isCreatedByStatefulCreatePages: false,
    };
    translatePage({ page, actions } as any, options);

    expect(actions.deletePage).toHaveBeenCalledWith(page);
    expect(actions.createPage).toHaveBeenCalledTimes(1);
    expect(actions.createPage).toHaveBeenNthCalledWith(1, {
      ...page,
      context: {
        locale: 'en-US',
        prefix: 'en',
        localePagesId: 'imprint',
        translations: [
          {
            locale: 'de-CH',
            path: '/de/impressum',
          },
        ],
      },
    });
  });

  it('should translate unstateful created pages and adjust the path', () => {
    const page: Page = {
      path: '/imprint',
      component: {} as any,
      context: {
        locale: 'de-CH',
        referTranslations: ['en-US', 'zh-CN'],
        adjustPath: true,
      },
      isCreatedByStatefulCreatePages: false,
    };
    translatePage({ page, actions } as any, options);

    expect(actions.deletePage).toHaveBeenCalledWith(page);
    expect(actions.createPage).toHaveBeenCalledTimes(1);
    expect(actions.createPage).toHaveBeenNthCalledWith(1, {
      ...page,
      path: '/de/impressum',
      context: {
        locale: 'de-CH',
        prefix: 'de',
        localePagesId: 'imprint',
        translations: [
          {
            locale: 'en-US',
            path: '/imprint',
          },
          {
            locale: 'zh-CN',
            path: '/zh/imprint',
          },
        ],
      },
    });
  });

  it('should skip already translated pages', () => {
    const page: Page = {
      path: '/imprint',
      component: {} as any,
      context: {
        locale: 'de-CH',
        localePagesId: 'imprint',
      },
    };

    translatePage({ page, actions } as any, options);

    expect(actions.deletePage).not.toHaveBeenCalled();
    expect(actions.createPage).not.toHaveBeenCalled();
  });

  it('should obey page blacklists', () => {
    const page: Page = {
      path: '/do-not-translate-to-german',
      component: {} as any,
      context: {},
      isCreatedByStatefulCreatePages: true,
    };

    translatePage({ page, actions } as any, options);

    expect(actions.createPage).toMatchSnapshot();
  });
});
