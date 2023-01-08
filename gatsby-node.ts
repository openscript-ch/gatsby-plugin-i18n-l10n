import { GatsbyNode } from 'gatsby';
import { customizeSitePageContext } from './src/createSchemaCustomization/customizeSitePageContext';
import { translateNode } from './src/onCreateNode/translateNode';
import { translatePage } from './src/onCreatePage/translatePage';
import { sourceTranslationNodes } from './src/sourceNodes/sourceTranslationNodes';
import { PluginOptions } from './types';

export const pluginOptionsSchema: GatsbyNode['pluginOptionsSchema'] = ({ Joi }) => {
  return Joi.object({
    defaultLocale: Joi.string().description('Sets the default locale'),
    siteUrl: Joi.string().required().description('Sets the absolute site url'),
    locales: Joi.array()
      .required()
      .items(
        Joi.object({
          locale: Joi.string().required().description('Defines the a locale.'),
          prefix: Joi.string().required().description('Defines the corresponding url prefix.'),
          slugs: Joi.object().required().description('Contains the translated slugs.'),
          messages: Joi.object().required().description('Contains the translated messages.'),
        }),
      ),
    pathBlacklist: Joi.array().description('Omit certain path segments'),
  });
};

export const onCreateNode: GatsbyNode['onCreateNode'] = async (args, options: PluginOptions) => {
  await translateNode(args, options);
};

export const onCreatePage: GatsbyNode['onCreatePage'] = async (args, options: PluginOptions) => {
  await translatePage(args, options);
};

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = async (args) => {
  customizeSitePageContext(args);
};

export const sourceNodes: GatsbyNode['sourceNodes'] = async (args, options: PluginOptions) => {
  sourceTranslationNodes(args, options);
};

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = async ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        path: require.resolve('path-browserify'),
      },
    },
  });
};
