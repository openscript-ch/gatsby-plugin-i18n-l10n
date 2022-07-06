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
      base: 'page.de.md',
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
      base: 'section.de.md',
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
      base: 'page.de.md',
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
      base: 'imprint.de.md',
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

  it('should translate slugs and using the frontmatter titles', async () => {
    fs.readdir = jest.fn().mockReturnValue(['imprint.de.md', 'imprint.en.md', 'imprint.fr.md']);

    const currentNode = {
      parent: '0',
      internal: {
        type: 'MarkdownRemark',
      },
      frontmatter: {
        title: 'Impressum',
      },
    };

    const allNodes = [
      {
        id: '0',
        base: 'imprint.de.md',
        relativeDirectory: 'pages',
        dir: '/tmp/project/content/pages',
        absolutePath: '/tmp/project/content/pages/imprint.de.md',
        children: ['m0'],
      },
      {
        id: '1',
        base: 'another.de.md',
        relativeDirectory: 'pages',
        dir: '/tmp/project/content/pages',
        absolutePath: '/tmp/project/content/pages/another.de.md',
      },
      {
        id: '2',
        base: 'imprint.en.md',
        relativeDirectory: 'pages',
        dir: '/tmp/project/content/pages',
        absolutePath: '/tmp/project/content/pages/imprint.en.md',
        children: ['m2'],
      },
      {
        id: '3',
        base: 'imprint.fr.md',
        relativeDirectory: 'pages',
        dir: '/tmp/project/content/pages',
        absolutePath: '/tmp/project/content/pages/imprint.fr.md',
        children: ['m1'],
      },
      {
        id: '4',
        base: 'more.de.md',
        relativeDirectory: 'sections',
        dir: '/tmp/project/content/sections',
        absolutePath: '/tmp/project/content/sections/more.de.md',
      },
      {
        id: 'm0',
        parent: '0',
        internal: {
          type: 'MarkdownRemark',
        },
        frontmatter: {
          title: 'Impressum',
        },
      },
      {
        id: 'm1',
        parent: '0',
        internal: {
          type: 'MarkdownRemark',
        },
        frontmatter: {
          title: 'Imprimer',
        },
      },
      {
        id: 'm2',
        parent: '0',
        internal: {
          type: 'MarkdownRemark',
        },
        frontmatter: {
          title: 'Imprint',
        },
      },
    ];

    const args: any = {
      getNode: jest.fn().mockImplementation((id: string) => allNodes.find((n) => n.id === id)),
      getNodes: jest.fn().mockReturnValue(allNodes),
      node: currentNode,
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
          slugs: {},
          messages: {},
        },
        {
          locale: `fr-FR`,
          prefix: `fr`,
          slugs: {},
          messages: {},
        },
      ],
      plugins: [],
    };

    await translateNode(args, currentOptions);

    expect(createNodeField).toHaveBeenNthCalledWith(1, { node: currentNode, name: 'locale', value: 'de-CH' });
    expect(createNodeField).toHaveBeenNthCalledWith(2, { node: currentNode, name: 'filename', value: 'imprint' });
    expect(createNodeField).toHaveBeenNthCalledWith(3, { node: currentNode, name: 'kind', value: 'pages' });
    expect(createNodeField).toHaveBeenNthCalledWith(4, { node: currentNode, name: 'slug', value: 'impressum' });
    expect(createNodeField).toHaveBeenNthCalledWith(5, { node: currentNode, name: 'path', value: '/de/pages/impressum' });
    expect(createNodeField).toHaveBeenNthCalledWith(6, { node: currentNode, name: 'pathPrefix', value: 'de' });
    expect(createNodeField).toHaveBeenNthCalledWith(7, {
      node: currentNode,
      name: 'translations',
      value: [
        { locale: 'en-US', path: '/pages/imprint' },
        { locale: 'fr-FR', path: '/fr/pages/imprimer' },
      ],
    });
  });
});
