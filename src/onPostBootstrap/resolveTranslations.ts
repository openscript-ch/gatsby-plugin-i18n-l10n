import { Node } from 'gatsby';
import { FileSystemNode } from 'gatsby-source-filesystem';
import { posix as path } from 'path';
import { OnPostBootstrap, PluginOptions } from '../../types';
import { findClosestLocale, parseFilename } from '../utils/i18n';
import { extractFrontmatterTitle } from '../utils/markdown';
import { translatePath, trimRightSlash } from '../utils/path';

const findLocale = (estimatedLocale: string, options: PluginOptions) => {
  return (
    findClosestLocale(
      estimatedLocale,
      options.locales.map((l) => l.locale),
    ) || estimatedLocale
  );
};

/**
 * Find siblings (files which are translations of the given file)
 *
 * @param nodes a list of file system nodes
 * @param absolutePath of the file which siblings should be searched
 * @param options is the configuration of the current plugin instance
 * @returns siblings paths
 */
const findTranslations = (nodes: Node[], absolutePath: string, options: PluginOptions) => {
  const fileNodes = nodes.filter((n) => n.internal.type === 'File') as FileSystemNode[];
  const markdownNodes = nodes.filter((n) => ['MarkdownRemark', 'Mdx'].includes(n.internal.type));
  const fileSiblings = fileNodes.filter((n) => n.dir === path.dirname(absolutePath));
  const { filename } = parseFilename(path.basename(absolutePath), options.defaultLocale);
  const siblings = fileSiblings
    .filter((f) => {
      const { filename: siblingFilename } = parseFilename(f.base, options.defaultLocale);
      return f.base !== path.basename(absolutePath) && siblingFilename === filename;
    })
    .map((f) => {
      const { filename: siblingFilename, estimatedLocale: siblingEstimatedLocale } = parseFilename(f.base, options.defaultLocale);
      const markdownNode = markdownNodes.filter((n) => f.children.map((c) => c).includes(n.id)).find((n) => n);
      const title = extractFrontmatterTitle(markdownNode);
      const locale = findLocale(siblingEstimatedLocale, options);
      return { filename: siblingFilename, locale, title };
    });

  return siblings;
};

export const resolveTranslations: OnPostBootstrap = async ({ getNode, getNodes, actions }, options) => {
  if (!options) {
    return;
  }

  const { createNodeField } = actions;
  const nodes = getNodes();

  nodes
    .filter((n) => ['MarkdownRemark', 'Mdx'].includes(n.internal.type))
    .forEach((n) => {
      if (n.parent === null) {
        return;
      }

      const fileSystemNode = getNode(n.parent) as FileSystemNode | undefined;
      if (!fileSystemNode) {
        return;
      }

      const { relativeDirectory, absolutePath } = fileSystemNode;

      const translations = findTranslations(getNodes(), absolutePath, options).map((t) => {
        const { filepath: translatedFilepath } = translatePath(t.filename, relativeDirectory, t.locale, options, t.title);
        return { path: trimRightSlash(translatedFilepath), locale: t.locale };
      });

      createNodeField({ node: n, name: 'translations', value: translations });
    });
};
