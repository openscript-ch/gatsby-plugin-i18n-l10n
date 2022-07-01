import { IntlProvider } from 'react-intl';
import { SitePageContext, Translation, WrapPageElement } from '../types';
import I18nHead from './components/I18nHead';
import { I18nL10nContext } from './contexts/I18nL10nContext';

export const wrapPageElement: WrapPageElement = ({ element, props }, options) => {
  const pageContext = props.pageContext as SitePageContext;
  const translations = (props.pageContext.translations as Translation[]) || [];
  const locale = pageContext.locale ?? options.defaultLocale;
  const currentLocale = options.locales.find((l) => l.locale === locale);
  const prefix = pageContext.prefix ?? currentLocale?.prefix;
  const currentMessages = { ...currentLocale?.messages, ...currentLocale?.slugs };

  if (currentMessages) {
    // Inject language names of all available languages into current messages
    options.locales.forEach((l) => {
      currentMessages[`languages.${l.locale}`] = l.messages.language;
    });
  }

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <I18nL10nContext.Provider value={{ locale, prefix, translations }}>
      <IntlProvider defaultLocale={options.defaultLocale} locale={locale} messages={currentMessages}>
        <I18nHead currentLocale={locale} translations={translations} pathname={props.location.pathname} siteUrl={options.siteUrl} />
        {element}
      </IntlProvider>
    </I18nL10nContext.Provider>
  );
};
