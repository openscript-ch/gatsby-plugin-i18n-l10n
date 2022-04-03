import { Link } from 'gatsby';
import path from 'path';
import { PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import { useI18nL10nContext } from '../contexts/I18nL10nContext';
import { trimRightSlash } from '../utils/path';

type LocalizedLinkProps = PropsWithChildren<{
  className?: string;
  to: string;
  activeClassName?: string;
  activeStyle?: object;
  partiallyActive?: boolean;
}>;

export default function LocalizedLink({
  to,
  children,
  className,
  activeClassName = 'active',
  activeStyle = {},
  partiallyActive = true,
}: LocalizedLinkProps) {
  const pageContext = useI18nL10nContext();
  const prefix = pageContext.prefix ?? '';
  const intl = useIntl();
  const getSlug = () => (intl.messages[to] ? intl.formatMessage({ id: to }) : to);
  const localizedPath = to !== '/' ? getSlug() : '/';
  const prefixedPath = intl.defaultLocale === intl.locale ? localizedPath : trimRightSlash(path.join('/', prefix, localizedPath));
  return (
    <Link
      to={prefixedPath}
      className={className}
      activeClassName={activeClassName}
      activeStyle={activeStyle}
      partiallyActive={partiallyActive}
    >
      {children}
    </Link>
  );
}
