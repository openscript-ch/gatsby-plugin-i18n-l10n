import { posix as nodePath } from 'path';
import { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { useI18nL10nContext } from '../contexts/I18nL10nContext';
import { trimRightSlash } from '../utils/path';

type LinkProps = {
  className?: string;
  to: string;
  activeClassName?: string;
  activeStyle?: object;
  partiallyActive?: boolean;
  replace?: boolean;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

type LocalizedLinkProps = {
  children: (args: LinkProps) => JSX.Element;
} & LinkProps;

export default function GenericLocalizedLink({
  to,
  children,
  className,
  activeClassName = 'active',
  activeStyle = {},
  partiallyActive = true,
  replace,
  onClick,
}: LocalizedLinkProps) {
  const pageContext = useI18nL10nContext();
  const prefix = pageContext.prefix ?? '';
  const intl = useIntl();
  const getSlug = () => (intl.messages[to] ? intl.formatMessage({ id: to }) : to);
  const localizedPath = to !== '/' ? getSlug() : '/';
  const prefixedPath = intl.defaultLocale === intl.locale ? localizedPath : trimRightSlash(nodePath.join('/', prefix, localizedPath));
  return <Fragment>{children({ to: prefixedPath, className, activeClassName, activeStyle, partiallyActive, replace, onClick })}</Fragment>;
}
