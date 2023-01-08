import { CreateSchemaCustomization } from '../../types';

export const customizeSitePageContext: CreateSchemaCustomization = async ({ actions }) => {
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
