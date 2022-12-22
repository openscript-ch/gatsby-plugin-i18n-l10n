import { css, Theme } from '@emotion/react';
import { LocalizedLink } from 'gatsby-plugin-i18n-l10n';
import LanguageSelector from './LanguageSelector';
import MainNavigation from './MainNavigation';

const headerStyle = (theme: Theme) => css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 6rem;
  font-size: 2rem;
  font-weight: bold;
  background-color: ${theme.secondaryColor};
`;

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header css={headerStyle}>
      <LocalizedLink to="/">{title}</LocalizedLink>
      <MainNavigation />
      <LanguageSelector />
    </header>
  );
}
