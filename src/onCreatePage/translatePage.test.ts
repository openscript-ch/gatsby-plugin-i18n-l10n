import { Page } from 'gatsby';
import { PluginOptions } from '../../types';
import { translatePage } from './translatePage';

describe('translatePage', () => {
  it('should translate stateful created pages', () => {
    const page: Page = {
      path: '/imprint',
      component: {} as any,
      context: {},
      isCreatedByStatefulCreatePages: true,
    };
    const actions = {
      createPage: jest.fn(),
      deletePage: jest.fn(),
    };
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
          slugs: {},
          messages: {},
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
    translatePage({ page, actions } as any, options);

    expect(actions.deletePage).toBeCalledWith(page);
    expect(actions.createPage).toHaveBeenCalledTimes(3);
    expect(actions.createPage).toHaveBeenNthCalledWith(1, {
      ...page,
      context: {
        locale: 'en-US',
        prefix: 'en',
        translations: [
          {
            locale: 'de-CH',
            path: '/de/imprint',
          },
          {
            locale: 'zh-CN',
            path: '/zh/imprint',
          },
        ],
      },
    });
    expect(actions.createPage).toHaveBeenNthCalledWith(2, {
      ...page,
      context: {
        locale: 'de-CH',
        prefix: 'de',
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
      path: '/de/imprint',
    });
    expect(actions.createPage).toHaveBeenNthCalledWith(3, {
      ...page,
      context: {
        locale: 'zh-CN',
        prefix: 'zh',
        translations: [
          {
            locale: 'en-US',
            path: '/imprint',
          },
          {
            locale: 'de-CH',
            path: '/de/imprint',
          },
        ],
      },
      path: '/zh/imprint',
    });
  });

  it('should translate unstateful created pages', () => {
    const page: Page = {
      path: '/imprint',
      component: {} as any,
      context: {},
      isCreatedByStatefulCreatePages: false,
    };
    const actions = {
      createPage: jest.fn(),
      deletePage: jest.fn(),
    };
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
          slugs: {},
          messages: {},
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
    translatePage({ page, actions } as any, options);

    expect(actions.deletePage).toBeCalledWith(page);
    expect(actions.createPage).toHaveBeenCalledTimes(1);
    expect(actions.createPage).toHaveBeenNthCalledWith(1, {
      ...page,
      context: {
        locale: 'en-US',
        prefix: 'en',
      },
    });
  });
});
