import { CreatePagesArgs } from 'gatsby';
import { resolve } from 'path';

const genericPageTemplate = resolve('./src/templates/GenericPage.tsx');

export async function CreateGenericPages({ actions, graphql }: CreatePagesArgs) {
  const { createPage } = actions;
  const allPages = await graphql<Queries.AllGenericPagesQuery>(`
    query AllGenericPages {
      allMdx(filter: { fields: { kind: { eq: "pages" } } }) {
        edges {
          node {
            id
            fields {
              path
              translations {
                locale
                path
              }
            }
            internal {
              contentFilePath
            }
          }
        }
      }
    }
  `);

  allPages.data?.allMdx.edges.forEach(p => {
    if (p.node.fields && p.node.fields.path) {
      createPage({
        component: `${genericPageTemplate}?__contentFilePath=${p.node.internal.contentFilePath}`,
        context: { id: p.node.id, translations: p.node.fields.translations },
        path: p.node.fields.path,
      });
    }
  });
}
