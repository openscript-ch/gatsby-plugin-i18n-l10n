import { PluginOptions } from '../../types';
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
    dir: '/tmp/project/content/sections',
    absolutePath: '/tmp/project/content/sections/special/more.de.md',
  },
  { ...node },
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

const createNodeField = jest.fn();
const getNode = jest.fn().mockImplementation((id: string) => allNodes.find((n) => n.id === id));
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
  });
});
