import { posix as nodePath } from 'path';
import { Link, PluginOptions } from 'gatsby';
import { PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import { useI18nL10nContext } from '../contexts/I18nL10nContext';
import { handleTrailingSlash } from '../utils/path';

type LocalizedLinkProps = PropsWithChildren<{
  className?: string;
  to: string;
  activeClassName?: string;
  activeStyle?: object;
  partiallyActive?: boolean;
  replace?: boolean;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  trailingSlash?: PluginOptions['trailingSlash'];
}>;

export default function LocalizedLink({
  to,
  children,
  className,
  activeClassName = 'active',
  activeStyle = {},
  partiallyActive = true,
  replace,
  onClick,
  trailingSlash,
}: LocalizedLinkProps) {
  const pageContext = useI18nL10nContext();
  const prefix = pageContext.prefix ?? '';
  const intl = useIntl();
  const getSlug = () => (intl.messages[to] ? intl.formatMessage({ id: to }) : to);
  const localizedPath = to !== '/' ? getSlug() : '/';
  const prefixedPath =
    intl.defaultLocale === intl.locale ? localizedPath : handleTrailingSlash(nodePath.join('/', prefix, localizedPath), trailingSlash);
  return (
    <Link
      to={prefixedPath}
      className={className}
      activeClassName={activeClassName}
      activeStyle={activeStyle}
      partiallyActive={partiallyActive}
      replace={replace}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
