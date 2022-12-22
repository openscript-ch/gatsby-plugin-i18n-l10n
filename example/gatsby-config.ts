import { GatsbyConfig } from 'gatsby';
import path from 'path';
import deCHMessages from './content/i18n/de-CH.json';
import enUSMessages from './content/i18n/en-US.json';
import zhCNMessages from './content/i18n/zh-CN.json';
import packageJson from './package.json';

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const siteUrl = process.env.SITE_URL || `https://example.com`;

const configuration: GatsbyConfig = {
  pathPrefix: process.env.PATH_PREFIX || '/',
  siteMetadata: {
    title: `Gatsby Starter Dogmatism`,
    description: `This is a quite opinionated Gatsby starter.`,
    author: `openscript`,
    siteUrl,
    version: packageJson.version,
    project: packageJson.name,
  },
  graphqlTypegen: {
    typesOutputPath: 'graphql-types.ts',
    documentSearchPaths: [`./gatsby-node.ts`, `./plugins/**/gatsby-node.ts`, `./src/**/*.ts?(x)`],
    generateOnBuild: true,
  },
  plugins: [
    // Sources
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `content/data`,
      },
    },

    // Transformers
    `gatsby-transformer-sharp`,

    // Plugins
    `gatsby-plugin-image`,
    `gatsby-plugin-catch-links`,
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: [`.md`, `.mdx`],
        gatsbyRemarkPlugins: [
          'gatsby-remark-copy-linked-files',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1140,
              quality: 90,
              linkImagesToOriginal: false,
            },
          },
          'gatsby-remark-autolink-headers',
        ],
      },
    },
    {
      resolve: `gatsby-plugin-emotion`,
      options: {
        // Accepts the following options, all of which are defined by `@emotion/babel-plugin` plugin.
        // The values for each key in this example are the defaults the plugin uses.
        sourceMap: true,
        autoLabel: 'dev-only',
        labelFormat: `[local]`,
        cssPropOptimization: true,
      },
    },
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/statics/icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,

    // Local plugins
    {
      resolve: 'gatsby-plugin-i18n-l10n',
      options: {
        defaultLocale: `en-US`,
        siteUrl,
        locales: [
          {
            locale: `en-US`,
            prefix: `en`,
            slugs: {},
            messages: enUSMessages,
          },
          {
            locale: `de-CH`,
            prefix: `de`,
            slugs: {},
            messages: deCHMessages,
          },
          {
            locale: `zh-CN`,
            prefix: `zh`,
            slugs: {},
            messages: zhCNMessages,
          },
        ],
      },
    },
  ],
};

export default configuration;
