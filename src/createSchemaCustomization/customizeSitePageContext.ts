import { GatsbyNodeCreateSchemaCustomization } from '../../types';

export const customizeSitePageContext: GatsbyNodeCreateSchemaCustomization = async ({ actions }) => {
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
