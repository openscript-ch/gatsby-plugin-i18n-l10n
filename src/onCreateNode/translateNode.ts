import { FileSystemNode } from 'gatsby-source-filesystem';
import { OnCreateNode } from '../../types';
import { translatePath } from '../utils/path';
import { findLocale, parseFilename } from '../utils/i18n';
import { extractFrontmatterTitle } from '../utils/markdown';

export const translateNode: OnCreateNode = async ({ getNode, node, actions }, options) => {
  const { createNodeField } = actions;

  if ((node.internal.type === 'MarkdownRemark' || node.internal.type === 'Mdx') && node.parent && options) {
    const fileSystemNode = getNode(node.parent);
    const { base, relativeDirectory } = fileSystemNode as FileSystemNode;
    const { filename, estimatedLocale } = parseFilename(base, options.defaultLocale);
    const title = extractFrontmatterTitle(node);
    const locale = findLocale(estimatedLocale, options);
    const { slug, kind, filepath } = translatePath(filename, relativeDirectory, locale, options, title);
    const localeOption = options.locales.find((l) => l.locale === locale);

    createNodeField({ node, name: 'locale', value: locale });
    createNodeField({ node, name: 'filename', value: filename });
    createNodeField({ node, name: 'kind', value: kind });
    createNodeField({ node, name: 'slug', value: slug });
    createNodeField({ node, name: 'path', value: filepath });
    createNodeField({ node, name: 'pathPrefix', value: localeOption?.prefix });
  }
};
