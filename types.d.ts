import { GatsbyBrowser, GatsbyNode, GatsbySSR, PluginOptions as GatsbyPluginOptions, RenderBodyArgs } from 'gatsby';

declare module 'gatsby' {
  export interface Page<TContext = Record<string, unknown>> {
    path: string;
    matchPath?: string;
    component: string;
    context: TContext;
    isCreatedByStatefulCreatePages?: boolean;
  }
}

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
  prefix?: string;
};

export type PluginOptions = {
  defaultLocale: string;
  siteUrl: string;
  locales: {
    locale: string;
    prefix: string;
    slugs: Record<string, string>;
    messages: Record<string, string>;
  }[];
  pathBlacklist?: string[];
} & GatsbyPluginOptions;

type GatsbyNodeOnCreatePage = NonNullable<GatsbyNode['onCreatePage']>;
type GatsbyNodeOnCreateNode = NonNullable<GatsbyNode['onCreateNode']>;

export type OnCreatePage = (args: Parameters<GatsbyNodeOnCreatePage>[0], options?: PluginOptions) => ReturnType<GatsbyNodeOnCreatePage>;
export type OnCreateNode = (args: Parameters<GatsbyNodeOnCreateNode>[0], options?: PluginOptions) => ReturnType<GatsbyNodeOnCreateNode>;

type GatsbyBrowserWrapPageElement = NonNullable<GatsbyBrowser['wrapPageElement']>;
type GatsbySSRWrapPageElement = NonNullable<GatsbySSR['wrapPageElement']>;

type GatsbyBrowserWrapPageElementParams = Parameters<GatsbyBrowserWrapPageElement>;
type GatsbySSRWrapPageElementParams = Parameters<GatsbySSRWrapPageElement>;
type GatsbyBrowserWrapPageElementReturnType = ReturnType<GatsbyBrowserWrapPageElement>;
type GatsbySSRWrapPageElementReturnType = ReturnType<GatsbySSRWrapPageElement>;
export type WrapPageElement = (
  args: GatsbyBrowserWrapPageElementParams[0] | GatsbySSRWrapPageElementParams[0],
  options: PluginOptions,
) => GatsbyBrowserWrapPageElementReturnType | GatsbySSRWrapPageElementReturnType;

type CustomRenderBodyArgs = RenderBodyArgs & { loadPageDataSync: (pathname: string) => { result: Record<string, unknown> } };
export type OnRenderBody = (args: CustomRenderBodyArgs, options: PluginOptions) => void;
