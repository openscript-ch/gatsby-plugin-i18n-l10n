import { graphql, useStaticQuery } from 'gatsby';
import { Fragment } from 'react';

type DocumentProps = {
  title?: string;
  description?: string;
};

export function Document({ title, description }: DocumentProps) {
  const siteMetadataQuery = useStaticQuery<Queries.DocumentSiteMetadataQuery>(graphql`
    query DocumentSiteMetadata {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `);

  const siteMetaData = siteMetadataQuery.site?.siteMetadata;
  const headElements = [];

  if (title || siteMetaData?.title) {
    let pageTitle = title || siteMetaData?.title || '';
    pageTitle = title && siteMetaData?.title ? `${title} - ${siteMetaData?.title}` : pageTitle;
    headElements.push(<title key="pageTitle">{pageTitle}</title>);
  }

  if (description || siteMetaData?.description) {
    const pageDescription = description || siteMetaData?.description || '';
    headElements.push(<meta key="pageDescription" name="description" content={pageDescription} />);
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <Fragment>{[...headElements]}</Fragment>;
}
