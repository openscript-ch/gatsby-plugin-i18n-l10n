import { graphql, PageProps } from 'gatsby';

import { Document } from '../layouts/default/Document';
import { DefaultLayout } from '../layouts/DefaultLayout';

export default function IndexPage({ data }: PageProps<Queries.IndexPageQuery>) {
  return <DefaultLayout>{data.mdx?.body}</DefaultLayout>;
}

export function Head() {
  return <Document title="Home" />;
}

export const query = graphql`
  query IndexPage($locale: String!) {
    mdx(fields: { kind: { eq: "sections" }, locale: { eq: $locale }, slug: { eq: "slogan" } }) {
      body
    }
  }
`;
