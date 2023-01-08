import { CreateSchemaCustomizationArgs } from 'gatsby';

export const customizeSitePageContext = async ({ actions }: CreateSchemaCustomizationArgs) => {
  actions.createTypes(`
    type SitePage implements Node {
      context: SitePageContext
    }
    type SitePageContext {
      locale: String
      localePagesId: String
      prefix: String
    }
  `);
};
