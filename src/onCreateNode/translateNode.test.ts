import fs from 'fs/promises';
import { PluginOptions } from '../../types';
import { translateNode } from './translateNode';

jest.mock('fs/promises');

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

const node = {
  parent: '1',
  internal: {
    type: 'MarkdownRemark',
  },
  frontmatter: {
    title: '',
  },
};

let createNodeField = jest.fn();

describe('translateNode', () => {
  beforeEach(() => {
    createNodeField = jest.fn();
  });

  it('should create nodes with translation information', async () => {
    fs.readdir = jest.fn().mockReturnValue(['page.en.md', 'page.zh-CN.md']);

    const parentNode = {
      name: 'page.de.md',
      relativeDirectory: 'pages',
      absolutePath: '/tmp/project/content/pages/page.de.md',
    };

    const args: any = {
      getNode: jest.fn().mockReturnValue(parentNode),
      node,
      actions: {
        createNodeField,
      },
    };

    await translateNode(args, options);

    expect(createNodeField).toHaveBeenNthCalledWith(1, { node, name: 'locale', value: 'de-CH' });
    expect(createNodeField).toHaveBeenNthCalledWith(2, { node, name: 'filename', value: 'page' });
    expect(createNodeField).toHaveBeenNthCalledWith(3, { node, name: 'kind', value: 'pages' });
    expect(createNodeField).toHaveBeenNthCalledWith(4, { node, name: 'slug', value: 'page' });
    expect(createNodeField).toHaveBeenNthCalledWith(5, { node, name: 'path', value: '/de/pages/page' });
    expect(createNodeField).toHaveBeenNthCalledWith(6, { node, name: 'pathPrefix', value: 'de' });
    expect(createNodeField).toHaveBeenNthCalledWith(7, {
      node,
      name: 'translations',
      value: [
        { locale: 'en-US', path: '/pages/page' },
        { locale: 'zh-CN', path: '/zh/pages/page' },
      ],
    });
  });

  it('should create nodes with accurate kind description', async () => {
    fs.readdir = jest.fn().mockReturnValue(['section.en.md', 'section.zh-CN.md']);

    const parentNode = {
      name: 'section.de.md',
      relativeDirectory: 'sections/special',
      absolutePath: '/tmp/project/content/sections/special/section.de.md',
    };

    const args: any = {
      getNode: jest.fn().mockReturnValue(parentNode),
      node,
      actions: {
        createNodeField,
      },
    };

    await translateNode(args, options);

    expect(createNodeField).toHaveBeenNthCalledWith(1, { node, name: 'locale', value: 'de-CH' });
    expect(createNodeField).toHaveBeenNthCalledWith(2, { node, name: 'filename', value: 'section' });
    expect(createNodeField).toHaveBeenNthCalledWith(3, { node, name: 'kind', value: 'sections/special' });
    expect(createNodeField).toHaveBeenNthCalledWith(4, { node, name: 'slug', value: 'section' });
    expect(createNodeField).toHaveBeenNthCalledWith(5, { node, name: 'path', value: '/de/sections/special/section' });
    expect(createNodeField).toHaveBeenNthCalledWith(6, { node, name: 'pathPrefix', value: 'de' });
    expect(createNodeField).toHaveBeenNthCalledWith(7, {
      node,
      name: 'translations',
      value: [
        { locale: 'en-US', path: '/sections/special/section' },
        { locale: 'zh-CN', path: '/zh/sections/special/section' },
      ],
    });
  });

  it('should remote blacklisted path segments when translating nodes', async () => {
    fs.readdir = jest.fn().mockReturnValue(['page.en.md', 'page.zh-CN.md']);

    const parentNode = {
      name: 'page.de.md',
      relativeDirectory: 'pages',
      absolutePath: '/tmp/project/content/pages/page.de.md',
    };

    const args: any = {
      getNode: jest.fn().mockReturnValue(parentNode),
      node,
      actions: {
        createNodeField,
      },
    };

    const currentOptions: PluginOptions = {
      ...options,
      pathBlacklist: [`/pages`],
    };

    await translateNode(args, currentOptions);

    expect(createNodeField).toHaveBeenNthCalledWith(1, { node, name: 'locale', value: 'de-CH' });
    expect(createNodeField).toHaveBeenNthCalledWith(2, { node, name: 'filename', value: 'page' });
    expect(createNodeField).toHaveBeenNthCalledWith(3, { node, name: 'kind', value: 'pages' });
    expect(createNodeField).toHaveBeenNthCalledWith(4, { node, name: 'slug', value: 'page' });
    expect(createNodeField).toHaveBeenNthCalledWith(5, { node, name: 'path', value: '/de/page' });
    expect(createNodeField).toHaveBeenNthCalledWith(6, { node, name: 'pathPrefix', value: 'de' });
    expect(createNodeField).toHaveBeenNthCalledWith(7, {
      node,
      name: 'translations',
      value: [
        { locale: 'en-US', path: '/page' },
        { locale: 'zh-CN', path: '/zh/page' },
      ],
    });
  });

  it('should translate slugs', async () => {
    fs.readdir = jest.fn().mockReturnValue(['imprint.en.md', 'imprint.fr.md']);

    const parentNode = {
      name: 'imprint.de.md',
      relativeDirectory: 'pages',
      absolutePath: '/tmp/project/content/pages/imprint.de.md',
    };

    const args: any = {
      getNode: jest.fn().mockReturnValue(parentNode),
      node,
      actions: {
        createNodeField,
      },
    };

    const currentOptions: PluginOptions = {
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

    await translateNode(args, currentOptions);

    expect(createNodeField).toHaveBeenNthCalledWith(1, { node, name: 'locale', value: 'de-CH' });
    expect(createNodeField).toHaveBeenNthCalledWith(2, { node, name: 'filename', value: 'imprint' });
    expect(createNodeField).toHaveBeenNthCalledWith(3, { node, name: 'kind', value: 'pages' });
    expect(createNodeField).toHaveBeenNthCalledWith(4, { node, name: 'slug', value: 'imprint' });
    expect(createNodeField).toHaveBeenNthCalledWith(5, { node, name: 'path', value: '/de/pages/impressum' });
    expect(createNodeField).toHaveBeenNthCalledWith(6, { node, name: 'pathPrefix', value: 'de' });
    expect(createNodeField).toHaveBeenNthCalledWith(7, {
      node,
      name: 'translations',
      value: [
        { locale: 'en-US', path: '/pages/imprint' },
        { locale: 'fr-FR', path: '/fr/pages/imprimer' },
      ],
    });
  });
});
