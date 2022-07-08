import { PluginOptions } from '../../types';
import { resolveTranslations } from './resolveTranslations';

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

describe('resolveTranslations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create nodes with translation information', async () => {
    await resolveTranslations(args, options);

    expect(createNodeField).toHaveBeenNthCalledWith(1, {
      node,
      name: 'translations',
      value: [
        {
          locale: 'en-US',
          path: '/pages/imprint',
        },
        {
          locale: 'fr-FR',
          path: '/fr/pages/imprimer',
        },
      ],
    });
  });
});
