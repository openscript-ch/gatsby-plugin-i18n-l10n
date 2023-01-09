import { PluginOptions as GatsbyPluginOptions } from 'gatsby';

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
  localePageId?: string;
  prefix?: string;
};

declare module 'gatsby' {
  export interface Page<TContext = SitePageContext> {
    path: string;
    matchPath?: string;
    component: string;
    context: TContext;
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
