import { FileSystemNode } from 'gatsby-source-filesystem';
import { onCreateNode, PluginOptions } from '../../types';
import convertToSlug from 'limax';
import { addLocalePrefix, trimRightSlash } from '../utils/path';
import { findClosestLocale, parseFilename } from '../utils/i18n';
import fs from 'fs/promises';
import path from 'path';

export const translateNode: onCreateNode = async ({ getNode, node, actions }, options) => {
  const { createNodeField } = actions;

  if ((node.internal.type === 'MarkdownRemark' || node.internal.type === 'Mdx') && node.parent && options) {
    const fileSystemNode = getNode(node.parent);
    const { name, ext, relativeDirectory, absolutePath } = fileSystemNode as FileSystemNode;
    const { filename, estimatedLocale } = parseFilename(`${name}${ext}`, options.defaultLocale);
    const { title } = node['frontmatter'] as { title?: string };
    const locale = findLocale(estimatedLocale, options);
    const { slug, kind, filepath } = translatePath(filename, relativeDirectory, locale, options, title);
    const translations = await findTranslations(absolutePath, options);
    const alternativeLanguagePaths = translations.map(t => {
      const { filepath } = translatePath(t.filename, relativeDirectory, t.locale, options);
      return { path: trimRightSlash(filepath), locale: t.locale };
    });
    const localeOption = options.locales.find(l => l.locale === locale);

    createNodeField({ node, name: 'locale', value: locale });
    createNodeField({ node, name: 'filename', value: filename });
    createNodeField({ node, name: 'kind', value: kind });
    createNodeField({ node, name: 'slug', value: slug });
    createNodeField({ node, name: 'path', value: filepath });
    createNodeField({ node, name: 'pathPrefix', value: localeOption?.prefix });
    createNodeField({ node, name: 'translations', value: alternativeLanguagePaths });
  }
};

const findLocale = (estimatedLocale: string, options: PluginOptions) => {
  return (
    findClosestLocale(
      estimatedLocale,
      options.locales.map(l => l.locale)
    ) || estimatedLocale
  );
};

/**
 * Find siblings (files which are translations of the given file)
 *
 * @param absolutePath to the file for which siblings should be searched
 * @param options is the configuration of the current plugin instance
 * @returns siblings paths
 */
const findTranslations = async (absolutePath: string, options: PluginOptions) => {
  const fileSiblings = await fs.readdir(path.dirname(absolutePath));
  const { filename } = parseFilename(path.basename(absolutePath), options.defaultLocale);
  const siblings = fileSiblings
    .filter(f => {
      const { filename: siblingFilename } = parseFilename(f, options.defaultLocale);
      return f !== path.basename(absolutePath) && siblingFilename === filename;
    })
    .map(f => {
      const { filename: siblingFilename, estimatedLocale: siblingEstimatedLocale } = parseFilename(f, options.defaultLocale);
      const locale = findLocale(siblingEstimatedLocale, options);
      return { filename: siblingFilename, locale };
    });
  return siblings;
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
  const localeOption = options.locales.find(l => l.locale === locale);
  let filepath = addLocalePrefix(path.join('/', relativeDirectory, slug), locale, localeOption?.prefix || '', options.defaultLocale);
  if (relativeDirectory && localeOption) {
    filepath = filepath.replace(`/${relativeDirectory}`, localeOption.slugs[`/${relativeDirectory}`] || `/${relativeDirectory}`);
  }

  return { slug, kind: relativeDirectory, filepath };
};
