import { css } from '@emotion/react';
import { LanguageSwitcher } from 'gatsby-plugin-i18n-l10n';
import { useIntl } from 'react-intl';

const languageSelectorStyles = css`
  font-size: 1.4rem;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: inline;
      margin-left: 1rem;
    }
  }
`;

export default function LanguageSelector() {
  const intl = useIntl();

  return <LanguageSwitcher css={languageSelectorStyles} resolveLanguageName={locale => intl.formatMessage({ id: `languages.${locale}` })} />;
}
