import { PluginOptions as GatsbyPluginOptions, Page as GatsbyPage } from 'gatsby';

export type Frontmatter = {
  title?: string;
  tags?: string[];
};

export type Translation = {
  locale: string;
  path: string;
};

export type SitePageContext = {
  translations?: Translation[];
  locale?: string;
  localePagesId?: string;
  prefix?: string;
};

export type UnstatefulSitePageContext = {
  referTranslations?: any;
  adjustPath?: any;
  basePath?: string;
} & SitePageContext;

declare module 'gatsby' {
  export interface Page extends GatsbyPage {
    isCreatedByStatefulCreatePages?: boolean;
  }

  export interface PluginOptions extends GatsbyPluginOptions {
    defaultLocale: string;
    siteUrl: string;
    locales: {
      locale: string;
      prefix: string;
      slugs: Record<string, string>;
      messages: Record<string, string>;
    }[];
    pathBlacklist?: string[];
  }
}
