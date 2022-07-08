import { Node } from 'gatsby';

export const extractFrontmatterTitle = (node?: Node) => {
  if (node?.frontmatter && typeof node.frontmatter === 'object') {
    const frontmatter = node.frontmatter as { title?: string };
    return frontmatter.title;
  }

  return undefined;
};
