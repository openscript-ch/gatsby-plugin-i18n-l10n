jest.mock('fs/promises');

import { PluginOptions } from '../../types';
import { translateNode } from './translateNode';
import fs from 'fs/promises';

describe('translateNode', () => {
  it('should create nodes with translation information', async () => {
    const createNodeField = jest.fn();
    fs.readdir = jest.fn().mockReturnValue(['page.en.md', 'page.zh-CN.md']);

    const node = {
      parent: '1',
      internal: {
        type: 'MarkdownRemark',
      },
      frontmatter: {
        title: '',
      },
    };

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

    const options: PluginOptions = {
      defaultLocale: `en-US`,
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

    await translateNode(args, options);

    expect(createNodeField).toHaveBeenCalledWith({ node, name: 'locale', value: 'de-CH' });
    expect(createNodeField).toHaveBeenCalledWith({ node, name: 'filename', value: 'page' });
    expect(createNodeField).toHaveBeenCalledWith({ node, name: 'kind', value: 'pages' });
    expect(createNodeField).toHaveBeenCalledWith({ node, name: 'slug', value: 'page' });
    expect(createNodeField).toHaveBeenCalledWith({ node, name: 'path', value: '/de/pages/page' });
    expect(createNodeField).toHaveBeenCalledWith({
      node,
      name: 'translations',
      value: [
        { locale: 'en-US', path: '/pages/page' },
        { locale: 'zh-CN', path: '/zh/pages/page' },
      ],
    });
  });
  it('should create nodes with accurate kind description', async () => {
    const createNodeField = jest.fn();
    fs.readdir = jest.fn().mockReturnValue(['section.en.md', 'section.zh-CN.md']);

    const node = {
      parent: '1',
      internal: {
        type: 'MarkdownRemark',
      },
      frontmatter: {
        title: '',
      },
    };

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

    const options: PluginOptions = {
      defaultLocale: `en-US`,
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

    await translateNode(args, options);

    expect(createNodeField).toHaveBeenCalledWith({ node, name: 'locale', value: 'de-CH' });
    expect(createNodeField).toHaveBeenCalledWith({ node, name: 'filename', value: 'section' });
    expect(createNodeField).toHaveBeenCalledWith({ node, name: 'kind', value: 'sections/special' });
    expect(createNodeField).toHaveBeenCalledWith({ node, name: 'slug', value: 'section' });
    expect(createNodeField).toHaveBeenCalledWith({ node, name: 'path', value: '/de/sections/special/section' });
    expect(createNodeField).toHaveBeenCalledWith({
      node,
      name: 'translations',
      value: [
        { locale: 'en-US', path: '/sections/special/section' },
        { locale: 'zh-CN', path: '/zh/sections/special/section' },
      ],
    });
  });
});
