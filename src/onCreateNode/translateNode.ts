import { FileSystemNode } from 'gatsby-source-filesystem';
import convertToSlug from 'limax';
import { posix as path } from 'path';
import { Node } from 'gatsby';
import { OnCreateNode, PluginOptions } from '../../types';
import { addLocalePrefix, replaceSegmentsWithSlugs, trimRightSlash } from '../utils/path';
import { findClosestLocale, parseFilename } from '../utils/i18n';

const findLocale = (estimatedLocale: string, options: PluginOptions) => {
  return (
    findClosestLocale(
      estimatedLocale,
      options.locales.map((l) => l.locale),
    ) || estimatedLocale
  );
};

const extractFrontmatterTitle = (node?: Node) => {
  if (node?.frontmatter && typeof node.frontmatter === 'object') {
    const frontmatter = node.frontmatter as { title?: string };
    return frontmatter.title;
  }

  return undefined;
};

/**
 * Find siblings (files which are translations of the given file)
 *
 * @param nodes a list of file system nodes
 * @param absolutePath of the file which siblings should be searched
 * @param options is the configuration of the current plugin instance
 * @returns sibling nodes
 */
const findTranslations = (nodes: Node[], absolutePath: string, options: PluginOptions) => {
  const fileNodes = nodes.filter((n) => n.internal.type === 'File') as FileSystemNode[];
  const fileSiblings = fileNodes.filter((n) => n.dir === path.dirname(absolutePath));
  const { filename } = parseFilename(path.basename(absolutePath), options.defaultLocale);
  return fileSiblings.filter((f) => {
    const { filename: siblingFilename } = parseFilename(f.base, options.defaultLocale);
    return f.base !== path.basename(absolutePath) && siblingFilename === filename;
  });
};

/**
 * Returns a list of paths and locales to the sibling nodes
 *
 * @param siblings of the current node
 * @param markdownNodes which are available
 * @param options is the configuration of the current plugin instance
 * @returns a list of translations for the current node
 */
const getAvailableTranslations = (siblings: FileSystemNode[], markdownNodes: Node[], options: PluginOptions) => {
  return siblings.map((s) => {
    const { filename: siblingFilename, estimatedLocale: siblingEstimatedLocale } = parseFilename(s.base, options.defaultLocale);
    const markdownNode = markdownNodes.filter((n) => s.children.map((c) => c).includes(n.id)).find((n) => n);
    const title = extractFrontmatterTitle(markdownNode);
    const locale = findLocale(siblingEstimatedLocale, options);
    return { filename: siblingFilename, locale, title };
  });
};

/**
 * Translates paths based on filename, location, locale and plugin options
 *
 * @param filename of the designated file
 * @param relativeDirectory of the relative directory where the designated file resides in
 * @param locale of the designated file
 * @param options is the configuration of the current plugin instance
 * @param title which was read from frontmatter or elsewhere which belongs to this file
 * @returns a translated slug, a kind (relativeDirectory) and its filepath
 */
const translatePath = (filename: string, relativeDirectory: string, locale: string, options: PluginOptions, title?: string) => {
  let slug = '';
  if (filename.indexOf('index') === -1) {
    slug = title ? convertToSlug(title) : filename;
  }

  // 'relativeDirectory' is a synonym of 'kind'
  const localeOption = options.locales.find((l) => l.locale === locale);
  const currentPath = path.join('/', relativeDirectory, slug);

  // add locale prefix to path
  let filepath = addLocalePrefix(currentPath, locale, localeOption?.prefix || '', options.defaultLocale);

  // remove path segments which are on the path blacklist
  filepath = options.pathBlacklist?.reduce((prev, curr) => prev.replace(curr, ''), filepath) || filepath;

  // replace path segments with slugs
  if (localeOption) {
    filepath = replaceSegmentsWithSlugs(filepath, localeOption.slugs);
  }

  return { slug, kind: relativeDirectory, filepath };
};

export const translateNode: OnCreateNode = async ({ getNode, getNodes, node, actions }, options) => {
  const { createNodeField } = actions;

  if ((node.internal.type === 'MarkdownRemark' || node.internal.type === 'Mdx') && node.parent && options) {
    const fileSystemNode = getNode(node.parent);
    const { base, relativeDirectory, absolutePath } = fileSystemNode as FileSystemNode;
    const { filename, estimatedLocale } = parseFilename(base, options.defaultLocale);
    const title = extractFrontmatterTitle(node);
    const locale = findLocale(estimatedLocale, options);
    const { slug, kind, filepath } = translatePath(filename, relativeDirectory, locale, options, title);

    // propagate translations
    const nodes = getNodes();
    const markdownNodes = nodes.filter((n) => ['MarkdownRemark', 'Mdx'].includes(n.internal.type));
    const siblings = findTranslations(getNodes(), absolutePath, options);
    const translations = getAvailableTranslations(siblings, markdownNodes, options).map((t) => {
      const { filepath: translatedFilepath } = translatePath(t.filename, relativeDirectory, t.locale, options, t.title);
      return { path: trimRightSlash(translatedFilepath), locale: t.locale };
    });
    const localeOption = options.locales.find((l) => l.locale === locale);

    createNodeField({ node, name: 'locale', value: locale });
    createNodeField({ node, name: 'filename', value: filename });
    createNodeField({ node, name: 'kind', value: kind });
    createNodeField({ node, name: 'slug', value: slug });
    createNodeField({ node, name: 'path', value: filepath });
    createNodeField({ node, name: 'pathPrefix', value: localeOption?.prefix });
    createNodeField({ node, name: 'translations', value: translations });
  }
};
