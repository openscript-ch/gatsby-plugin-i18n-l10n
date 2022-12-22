import { GatsbyNode } from 'gatsby';
import { CreateGenericPages } from './src/gatsby/createPages/createGenericPages';

export const createPages: GatsbyNode['createPages'] = async args => {
  await CreateGenericPages(args);
};
