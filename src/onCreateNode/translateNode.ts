import { posix as path } from 'path';
import { FileSystemNode } from 'gatsby-source-filesystem';
import convertToSlug from 'limax';
import { Actions, CreateNodeArgs, Node, NodePluginArgs, PluginOptions } from 'gatsby';
import { Frontmatter, Translation } from '../../types';
import { addLocalePrefix, handleTrailingSlash, replaceSegmentsWithSlugs } from '../utils/path';
import { findClosestLocale, parseFilenameSuffix } from '../utils/i18n';

const MARKDOWN_TYPES = ['MarkdownRemark', 'Mdx'];

const findLocale = (estimatedLocale: string, options: PluginOptions) => {
  return (
    findClosestLocale(
      estimatedLocale,
      options.locales.map((l) => l.locale),
    ) || estimatedLocale
  );
};

const extractFrontmatter = (node?: Node) => {
  if (node?.frontmatter && typeof node.frontmatter === 'object') {
    const frontmatter = node.frontmatter as Frontmatter;
    return frontmatter;
  }

  return undefined;
};

const extractFieldsTranslations = (node?: Node) => {
  if (node?.fields && typeof node.fields === 'object') {
    const fields = node.fields as { translations?: Translation[] };
    return fields.translations || [];
  }

  return [];
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
  const { filename } = parseFilenameSuffix(path.basename(absolutePath), options.defaultLocale);
  return fileSiblings.filter((f) => {
    const { filename: siblingFilename } = parseFilenameSuffix(f.base, options.defaultLocale);
    return f.base !== path.basename(absolutePath) && siblingFilename === filename;
  });
};

const getMarkdownNode = (sibling: FileSystemNode, getNode: NodePluginArgs['getNode']) => {
  return sibling.children.map((c) => getNode(c)).find((c) => c !== undefined && MARKDOWN_TYPES.includes(c.internal.type));
};

/**
 * Returns a list of paths and locales to the sibling nodes
 *
 * @param siblings of the current node
 * @param getNode gets a node
 * @param options is the configuration of the current plugin instance
 * @returns a list of translations for the current node
 */
const getAvailableTranslations = (siblings: FileSystemNode[], getNode: NodePluginArgs['getNode'], options: PluginOptions) => {
  return siblings.flatMap((s) => {
    const { filename: siblingFilename, estimatedLocale: siblingEstimatedLocale } = parseFilenameSuffix(s.base, options.defaultLocale);
    const markdownNode = getMarkdownNode(s, getNode);

    if (!markdownNode) {
      return [];
    }

    const title = extractFrontmatter(markdownNode)?.title;
    const locale = findLocale(siblingEstimatedLocale, options);
    return { filename: siblingFilename, locale, title };
  });
};

/**
 * Propagate the current node and its translation to the existing nodes
 *
 * @param translation of the current node
 * @param siblings of the current node
 * @param getNode gets a node
 * @param createNodeField action to create new or overwrite node fields
 */
const propagateCurrentNode = (
  translation: Translation,
  siblings: FileSystemNode[],
  getNode: NodePluginArgs['getNode'],
  createNodeField: Actions['createNodeField'],
) => {
  siblings.forEach((s) => {
    const markdownNode = getMarkdownNode(s, getNode);

    if (!markdownNode) {
      return;
    }

    const currentTranslations = [translation, ...extractFieldsTranslations(markdownNode)].filter(
      // filter duplicates
      (v, i, a) => a.findIndex((vv) => vv.locale === v.locale) === i,
    );
    createNodeField({ node: markdownNode, name: 'translations', value: currentTranslations });
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

  // handle trailing slash
  filepath = handleTrailingSlash(filepath, options.trailingSlash);

  return { slug, kind: relativeDirectory, filepath };
};

const getTagsField = (tags?: string[]) => {
  if (!tags) {
    return [];
  }

  return tags.map((t) => ({ title: t, slug: convertToSlug(t) }));
};

export const translateNode = async ({ getNode, getNodes, node, actions }: CreateNodeArgs, options: PluginOptions) => {
  const { createNodeField } = actions;

  if (MARKDOWN_TYPES.includes(node.internal.type) && node.parent && options) {
    const fileSystemNode = getNode(node.parent);
    const { base, relativeDirectory, absolutePath } = fileSystemNode as FileSystemNode;
    const { filename, estimatedLocale } = parseFilenameSuffix(base, options.defaultLocale);
    const frontmatter = extractFrontmatter(node);
    const locale = findLocale(estimatedLocale, options);
    const localeOption = options.locales.find((l) => l.locale === locale);
    const prefix = locale === options.defaultLocale ? '' : localeOption?.prefix;
    const { slug, kind, filepath } = translatePath(filename, relativeDirectory, locale, options, frontmatter?.title);
    const tags = getTagsField(frontmatter?.tags);

    // propagate translations
    const siblings = findTranslations(getNodes(), absolutePath, options);
    const translations = getAvailableTranslations(siblings, getNode, options).map((t) => {
      const { filepath: translatedFilepath } = translatePath(t.filename, relativeDirectory, t.locale, options, t.title);
      return { path: handleTrailingSlash(translatedFilepath, options.trailingSlash), locale: t.locale };
    });

    createNodeField({ node, name: 'locale', value: locale });
    createNodeField({ node, name: 'filename', value: filename });
    createNodeField({ node, name: 'kind', value: kind });
    createNodeField({ node, name: 'slug', value: slug });
    createNodeField({ node, name: 'path', value: filepath });
    createNodeField({ node, name: 'pathPrefix', value: prefix });
    createNodeField({ node, name: 'translations', value: translations });
    propagateCurrentNode({ locale, path: filepath }, siblings, getNode, createNodeField);
    createNodeField({ node, name: 'tags', value: tags });
  }
};
