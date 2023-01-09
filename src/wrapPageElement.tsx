import { PluginOptions, WrapPageElementNodeArgs } from 'gatsby';
import { IntlProvider } from 'react-intl';
import { SitePageContext } from '../types';
import { I18nL10nContext } from './contexts/I18nL10nContext';

export const wrapPageElement = (
  { element, props }: WrapPageElementNodeArgs<Record<string, unknown>, SitePageContext>,
  options: PluginOptions,
) => {
  const translations = props.pageContext.translations || [];
  const locale = props.pageContext.locale ?? options.defaultLocale;
  const currentLocale = options.locales.find((l) => l.locale === locale);
  const prefix = props.pageContext.prefix ?? currentLocale?.prefix;
  const currentMessages = { ...currentLocale?.messages, ...currentLocale?.slugs };

  // Inject language names of all available languages into current messages
  options.locales.forEach((l) => {
    currentMessages[`languages.${l.locale}`] = l.messages.language;
  });

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <I18nL10nContext.Provider value={{ locale, prefix, translations }}>
      <IntlProvider defaultLocale={options.defaultLocale} locale={locale} messages={currentMessages}>
        {element}
      </IntlProvider>
    </I18nL10nContext.Provider>
  );
};
