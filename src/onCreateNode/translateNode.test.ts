import { PluginOptions } from 'gatsby';
import { translateNode } from './translateNode';

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
      locale: `fr-FR`,
      prefix: `fr`,
      slugs: {},
      messages: {},
    },
  ],
  plugins: [],
};

const node = {
  id: 'm0',
  parent: '0',
  internal: {
    type: 'MarkdownRemark',
  },
  frontmatter: {
    title: 'Impressum',
    tags: ['Erster Tag', 'Zweiter Tag'],
  },
};

const allNodes = [
  {
    id: '0',
    internal: {
      type: 'File',
    },
    base: 'imprint.de.md',
    relativeDirectory: 'pages',
    dir: '/tmp/project/content/pages',
    absolutePath: '/tmp/project/content/pages/imprint.de.md',
    children: ['m0'],
  },
  {
    id: '1',
    internal: {
      type: 'File',
    },
    base: 'another.de.md',
    relativeDirectory: 'pages',
    dir: '/tmp/project/content/pages',
    absolutePath: '/tmp/project/content/pages/another.de.md',
  },
  {
    id: '2',
    internal: {
      type: 'File',
    },
    base: 'imprint.en.md',
    relativeDirectory: 'pages',
    dir: '/tmp/project/content/pages',
    absolutePath: '/tmp/project/content/pages/imprint.en.md',
    children: ['m2'],
  },
  {
    id: '3',
    internal: {
      type: 'File',
    },
    base: 'imprint.fr.md',
    relativeDirectory: 'pages',
    dir: '/tmp/project/content/pages',
    absolutePath: '/tmp/project/content/pages/imprint.fr.md',
    children: ['m1'],
  },
  {
    id: '4',
    internal: {
      type: 'File',
    },
    base: 'more.de.md',
    relativeDirectory: 'sections/special',
    dir: '/tmp/project/content/sections/special',
    absolutePath: '/tmp/project/content/sections/special/more.de.md',
    children: ['m3'],
  },
  {
    id: '5',
    internal: {
      type: 'File',
    },
    base: 'more.en.json',
    relativeDirectory: 'sections/special',
    dir: '/tmp/project/content/sections/special',
    absolutePath: '/tmp/project/content/sections/special/more.en.json',
    children: ['j0'],
  },
  { ...node },
  {
    id: 'm1',
    parent: '3',
    internal: {
      type: 'MarkdownRemark',
    },
    frontmatter: {
      title: 'Imprimer',
    },
  },
  {
    id: 'm2',
    parent: '2',
    internal: {
      type: 'MarkdownRemark',
    },
    frontmatter: {
      title: 'Imprint',
    },
    fields: {
      translations: [
        { locale: 'de-CH', path: '/old/translation' },
        { locale: 'zh-CN', path: '/existing/translation' },
      ],
    },
  },
  {
    id: 'm3',
    parent: '4',
    internal: {
      type: 'MarkdownRemark',
    },
  },
  {
    id: 'j0',
    parent: '5',
    internal: {
      type: 'JSON',
    },
  },
];

const createNodeField = jest.fn();
const getNode = jest.fn((id: string) => allNodes.find((n) => n.id === id));
const getNodes = jest.fn().mockReturnValue(allNodes);
const args: any = {
  getNode,
  getNodes,
  node,
  actions: {
    createNodeField,
  },
};

describe('translateNode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create nodes with translation information', async () => {
    await translateNode(args, options);

    expect(createNodeField).toHaveBeenNthCalledWith(1, { node, name: 'locale', value: 'de-CH' });
    expect(createNodeField).toHaveBeenNthCalledWith(2, { node, name: 'filename', value: 'imprint' });
    expect(createNodeField).toHaveBeenNthCalledWith(3, { node, name: 'kind', value: 'pages' });
    expect(createNodeField).toHaveBeenNthCalledWith(4, { node, name: 'slug', value: 'impressum' });
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

  it('should return no prefix if it is the default locale', async () => {
    const currentNode = allNodes.find((a) => a.id === 'm2');
    const currentArgs = {
      ...args,
      node: currentNode,
    };
    await translateNode(currentArgs, options);

    expect(createNodeField).toHaveBeenNthCalledWith(1, { node: currentNode, name: 'locale', value: 'en-US' });
    expect(createNodeField).toHaveBeenNthCalledWith(2, { node: currentNode, name: 'filename', value: 'imprint' });
    expect(createNodeField).toHaveBeenNthCalledWith(3, { node: currentNode, name: 'kind', value: 'pages' });
    expect(createNodeField).toHaveBeenNthCalledWith(4, { node: currentNode, name: 'slug', value: 'imprint' });
    expect(createNodeField).toHaveBeenNthCalledWith(5, { node: currentNode, name: 'path', value: '/pages/imprint' });
    expect(createNodeField).toHaveBeenNthCalledWith(6, { node: currentNode, name: 'pathPrefix', value: '' });
    expect(createNodeField).toHaveBeenNthCalledWith(7, {
      node: currentNode,
      name: 'translations',
      value: [
        { locale: 'de-CH', path: '/de/pages/impressum' },
        { locale: 'fr-FR', path: '/fr/pages/imprimer' },
      ],
    });
  });

  it('should create nodes which are nested in folders', async () => {
    const currentNode = {
      parent: '4',
      internal: {
        type: 'MarkdownRemark',
      },
    };
    const currentArgs = {
      ...args,
      node: currentNode,
    };
    await translateNode(currentArgs, options);

    expect(createNodeField).toHaveBeenNthCalledWith(1, { node: currentNode, name: 'locale', value: 'de-CH' });
    expect(createNodeField).toHaveBeenNthCalledWith(2, { node: currentNode, name: 'filename', value: 'more' });
    expect(createNodeField).toHaveBeenNthCalledWith(3, { node: currentNode, name: 'kind', value: 'sections/special' });
    expect(createNodeField).toHaveBeenNthCalledWith(4, { node: currentNode, name: 'slug', value: 'more' });
    expect(createNodeField).toHaveBeenNthCalledWith(5, { node: currentNode, name: 'path', value: '/de/sections/special/more' });
    expect(createNodeField).toHaveBeenNthCalledWith(6, { node: currentNode, name: 'pathPrefix', value: 'de' });
    expect(createNodeField).toHaveBeenNthCalledWith(7, {
      node: currentNode,
      name: 'translations',
      value: [],
    });
  });

  it('should remote blacklisted path segments when translating nodes', async () => {
    const currentOptions: PluginOptions = {
      ...options,
      pathBlacklist: [`/pages`],
    };

    await translateNode(args, currentOptions);

    expect(createNodeField).toHaveBeenNthCalledWith(1, { node, name: 'locale', value: 'de-CH' });
    expect(createNodeField).toHaveBeenNthCalledWith(2, { node, name: 'filename', value: 'imprint' });
    expect(createNodeField).toHaveBeenNthCalledWith(3, { node, name: 'kind', value: 'pages' });
    expect(createNodeField).toHaveBeenNthCalledWith(4, { node, name: 'slug', value: 'impressum' });
    expect(createNodeField).toHaveBeenNthCalledWith(5, { node, name: 'path', value: '/de/impressum' });
    expect(createNodeField).toHaveBeenNthCalledWith(6, { node, name: 'pathPrefix', value: 'de' });
    expect(createNodeField).toHaveBeenNthCalledWith(7, {
      node,
      name: 'translations',
      value: [
        { locale: 'en-US', path: '/imprint' },
        { locale: 'fr-FR', path: '/fr/imprimer' },
      ],
    });
  });

  it('should translate slugs', async () => {
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
            '/pages': '/seiten',
          },
          messages: {},
        },
        {
          locale: `fr-FR`,
          prefix: `fr`,
          slugs: {
            '/pages': '/feuilles', // I know it's not a literal translation
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
    expect(createNodeField).toHaveBeenNthCalledWith(4, { node, name: 'slug', value: 'impressum' });
    expect(createNodeField).toHaveBeenNthCalledWith(5, { node, name: 'path', value: '/de/seiten/impressum' });
    expect(createNodeField).toHaveBeenNthCalledWith(6, { node, name: 'pathPrefix', value: 'de' });
    expect(createNodeField).toHaveBeenNthCalledWith(7, {
      node,
      name: 'translations',
      value: [
        { locale: 'en-US', path: '/pages/imprint' },
        { locale: 'fr-FR', path: '/fr/feuilles/imprimer' },
      ],
    });

    expect(createNodeField).toHaveBeenNthCalledWith(8, {
      node: allNodes.find((n) => n.id === 'm2'),
      name: 'translations',
      value: [
        { locale: 'de-CH', path: '/de/seiten/impressum' },
        { locale: 'zh-CN', path: '/existing/translation' },
      ],
    });
    expect(createNodeField).toHaveBeenNthCalledWith(9, {
      node: allNodes.find((n) => n.id === 'm1'),
      name: 'translations',
      value: [{ locale: 'de-CH', path: '/de/seiten/impressum' }],
    });
  });

  it('should sluggify tags', async () => {
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
            '/pages': '/seiten',
          },
          messages: {},
        },
        {
          locale: `fr-FR`,
          prefix: `fr`,
          slugs: {
            '/pages': '/feuilles', // I know it's not a literal translation
          },
          messages: {},
        },
      ],
      plugins: [],
    };

    await translateNode(args, currentOptions);

    expect(createNodeField).toHaveBeenNthCalledWith(10, {
      node,
      name: 'tags',
      value: [
        { slug: 'erster-tag', title: 'Erster Tag' },
        { slug: 'zweiter-tag', title: 'Zweiter Tag' },
      ],
    });
  });
});
