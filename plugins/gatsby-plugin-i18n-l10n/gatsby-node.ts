import { GatsbyNode } from 'gatsby';
import { translateNode } from './src/onCreateNode/translateNode';
import { translatePage } from './src/onCreatePage/translatePage';
import { PluginOptions } from './types';

export const pluginOptionsSchema: GatsbyNode['pluginOptionsSchema'] = ({ Joi }) => {
  return Joi.object({
    defaultLocale: Joi.string().description('Sets the default locale'),
    locales: Joi.array()
      .required()
      .items(
        Joi.object({
          locale: Joi.string().required().description('Defines the a locale.'),
          prefix: Joi.string().required().description('Defines the corresponding url prefix.'),
          slugs: Joi.object().required().description('Contains the translated slugs.'),
          messages: Joi.object().required().description('Contains the translated messages.'),
        })
      ),
  });
};

export const onCreateNode: GatsbyNode['onCreateNode'] = async (args, options: PluginOptions) => {
  await translateNode(args, options);
};

export const onCreatePage: GatsbyNode['onCreatePage'] = async (args, options: PluginOptions) => {
  await translatePage(args, options);
};

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = async ({ actions }) => {
  actions.createTypes(`
    type SitePage implements Node {
      context: SitePageContext
    }
    type SitePageContext {
      locale: String
      prefix: String
    }
  `);
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
