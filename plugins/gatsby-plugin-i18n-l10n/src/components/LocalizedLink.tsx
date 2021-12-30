import { Link } from 'gatsby';
import path from 'path';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { trimRightSlash } from '../utils/path';
import { PageContext } from '../wrapPageElement';

type LocalizedLinkProps = React.PropsWithChildren<{
  className?: string;
  to: string;
}>;

export default function LocalizedLink({ to, children, className }: LocalizedLinkProps) {
  const pageContext = useContext(PageContext);
  const prefix = pageContext.prefix ?? '';
  const intl = useIntl();
  const getSlug = () => (intl.messages[to] ? intl.formatMessage({ id: to }) : to);
  const localizedPath = to !== '/' ? getSlug() : '/';
  const prefixedPath = intl.defaultLocale === intl.locale ? localizedPath : trimRightSlash(path.join('/', prefix, localizedPath));
  return (
    <Link to={prefixedPath} className={className} activeClassName="active" partiallyActive={true}>
      {children}
    </Link>
  );
}
